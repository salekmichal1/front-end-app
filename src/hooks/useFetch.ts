import { useState, useEffect } from 'react';

export function useFetch<T>(url: string, method: string = 'GET') {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<String | Error | null>(null);
  const [options, setOptions] = useState<Object | null>(null);

  const postData = function (postData: Object) {
    setOptions({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });
  };

  const patchData = function (patchData: Object) {
    setOptions({
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patchData),
    });
  };

  const deleteData = function () {
    setOptions({
      method: 'DELETE',
    });
  };

  const getData = function () {
    setOptions({
      method: 'GET',
    });
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async function (fetchOptions?: Object) {
      setIsPending(true);

      try {
        const res = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        const data: T = await res.json();

        setIsPending(false);
        setData(data);
        setError(null);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('the fetch was aborted');
        } else {
          setIsPending(false);
          setError('Could not fetch the data');
        }
      }
    };

    if (method === 'GET') {
      fetchData();
    }
    if (method === 'POST' && options) {
      fetchData(options);
    }
    if (method === 'PATCH' && options) {
      fetchData(options);
    }
    if (method === 'DELETE' && options) {
      fetchData(options);
    }

    return () => {
      controller.abort();
    };
  }, [url, options, method]);

  return { data, isPending, error, postData, patchData, deleteData, getData };
}
