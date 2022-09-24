export function uidForToday() {
  let today = new Date();
  let yyyy = today.getFullYear();
  let mm = (today.getMonth() + 1).toString().padStart(2, "0");
  let dd = today.getDate().toString().padStart(2, "0");
  return `${mm}-${dd}-${yyyy}`;
}
