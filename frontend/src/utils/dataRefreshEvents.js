export const DATA_REFRESH_EVENT = "lifeos:data-refresh";

export const emitDataRefresh = () => {
  window.dispatchEvent(new Event(DATA_REFRESH_EVENT));
};
