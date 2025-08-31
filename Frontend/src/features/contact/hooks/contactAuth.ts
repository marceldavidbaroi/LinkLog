import type { ApiResponse } from "../../../types/api-response.type";
import Api from "../api/contactApi";
import useContactStore from "../store/contactStore";
import type { Person } from "../types/contact.type";

export const useContact = () => {
  const { setPerson, setLoading, setError, contactList, setContactList } =
    useContactStore();

  const create = async (payload: Partial<Person>) => {
    setLoading(true);
    setError(null);
    try {
      const data: ApiResponse<Person> = await Api.create(payload);
      setPerson(data?.data || null);

      // update contactList in-place
      if (data?.data) setContactList([...contactList, data.data]);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: number, payload: Partial<Person>) => {
    setLoading(true);
    setError(null);
    try {
      const data: ApiResponse<Person> = await Api.update({ id, payload });
      setPerson(data?.data || null);

      // update contactList in-place
      if (data?.data) {
        const updatedList = contactList.map((c) =>
          c.id === id ? { ...c, ...data.data } : c
        );
        setContactList(updatedList);
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
      setPerson(null);

      // update contactList in-place
      setContactList(contactList.filter((c) => c.id !== id));
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
      setContactList(data.data || []);
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
      const data: ApiResponse<Person> = await Api.getOne(id);
      setPerson(data?.data || null);
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
