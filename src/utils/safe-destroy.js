export default function safeDestroy(...objects) {
  [].concat(objects).forEach((item) => {
    if (item && typeof item.destroy === 'function') {
      item.destroy();
    }
  });
}
