import jsonStore from "./jsonStore.js";
import createSqliteStore from "./sqliteStore.js";

const driver = (process.env.DB_DRIVER || "json").toLowerCase();

let store;
if (driver === "sqlite") {
  try {
    store = createSqliteStore();
  } catch (e) {
    console.warn("[db] SQLite 初始化失败，回退到 JSON 存储：", e.message);
    store = jsonStore;
  }
} else {
  store = jsonStore;
}

console.log(`[db] 存储驱动：${store.driver}`);
export default store;
export { driver };
