import { api } from '../services/api';

const fetchImages = async ({
  pageParam = null,
}): Promise<GetImagesResponse> => {
  const { data } = await api.get('/api/images', {
    params: {
      after: pageParam,
    },
  });
  return data;
};

export { fetchImages };
