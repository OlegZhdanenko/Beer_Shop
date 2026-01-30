export const authStorage = {
  get access() {
    return localStorage.getItem("accessToken");
  },
  get refresh() {
    return localStorage.getItem("refreshToken");
  },
  set(access: string, refresh: string) {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
  },
  clear() {
    localStorage.clear();
  },
};
