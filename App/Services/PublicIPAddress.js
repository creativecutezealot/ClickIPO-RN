export default async baseURL => {
  const response = await fetch(baseURL + "/get_ip");
  const ip = response.text();
  return ip;
};
