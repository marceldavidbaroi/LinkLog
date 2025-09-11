import type { ApiResponse } from "../../../types/api-response.type";
import Api from "../api/interactionApi";
import useInteractionStore from "../store/interactionStore";
import type { Interaction } from "../types/interaction.type";

export const useInteraction = () => {
  const {
    setInteraction,
    setInteractionList,
    setLoading,
    setError,
    interactionList,
  } = useInteractionStore();

  const create = async (payload: Partial<Interaction>) => {
    setLoading(true);
    setError(null);
    try {
      const data: ApiResponse<Interaction> = await Api.create(payload);
      setInteraction(data?.data || null);

      // update interactionList in-place
      if (data?.data) setInteractionList([...interactionList, data.data]);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: number, payload: Partial<Interaction>) => {
    setLoading(true);
    setError(null);
    try {
      const data: ApiResponse<Interaction> = await Api.update({ id, payload });
      setInteraction(data?.data || null);

      // update interactionList in-place
      if (data?.data) {
        const updatedList = interactionList.map((i) =>
          i.id === id ? { ...i, ...data.data } : i
        );
        setInteractionList(updatedList);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await Api.remove(id);
      setInteraction(null);

      // update interactionList in-place
      setInteractionList(interactionList.filter((i) => i.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await Api.getAll();
      setInteractionList(data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getOne = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data: ApiResponse<Interaction> = await Api.getOne(id);
      setInteraction(data?.data || null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    create,
    update,
    remove,
    getAll,
    getOne,
  };
};
