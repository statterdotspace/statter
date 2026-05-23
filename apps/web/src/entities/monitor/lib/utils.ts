const uptimeFromId = (id: string) => {
  const hash = Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return Number((98 + (hash % 20) / 10).toFixed(1));
};

export { uptimeFromId };
