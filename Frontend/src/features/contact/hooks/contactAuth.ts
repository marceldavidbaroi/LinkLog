import type { ApiResponse } from "../../../types/api-response.type";
import Api from "../api/contactApi";
import useContactStore from "../store/contactStore";
import type { Person } from "../types/contact.type";

export const useContact = () => {
  const { setPerson, setLoading, setError, setContactList } = useContactStore();

  const create = async (payload: Partial<Person>) => {
    setLoading(true);
    setError(null);
    try {
      const data: ApiResponse<Person> = await Api.create(payload);
      console.log(data);
      setPerson(data?.data || null);
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
      console.log(data);
      // store only the array
      setContactList(data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getOne = async () => {
    setLoading(true);
    setError(null);
    try {
      // Replace with actual ID or parameter as needed
      const id = 1;
      const data: ApiResponse<Person> = await Api.getOne(id);
      console.log(data);
      setPerson(data?.data || null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  const update = async () => {
    setLoading(true);
    setError(null);
    try {
      // Replace with actual ID and payload as needed
      const id = 1;
      const payload: Partial<Person> = {};
      const data: ApiResponse<Person> = await Api.update({ id, payload });
      console.log(data);
      setPerson(data?.data || null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  const remove = async () => {
    setLoading(true);
    setError(null);
    try {
      // Replace with actual ID as needed
      const id = 1;
      const data: ApiResponse<null> = await Api.remove(id);
      console.log(data);
      setPerson(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    create,
    getAll,
    getOne,
    update,
    remove,
  };
};
