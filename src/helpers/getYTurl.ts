import api from "./youtubeApi";

const getYTurl = async (query: string) => {
  const { data } = await api.get<any>("/search", { params:{
    part: "snippet",
    q: query,
    type: "video",
  }});
  return `https://www.youtube.com/watch?v=${data.items[0].id.videoId}`;
}

export default getYTurl;
