const pipe = (...fns: Function[]): Function => {
  return (firstValue: any) =>
    fns.reduce((prevValue, fn) => fn(prevValue), firstValue);
};

export default pipe;
