interface Image {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface GetImagesResponse {
  after: string;
  data: Image[];
}

interface NewImageData {
  url: string;
  title: string;
  description: string;
}
