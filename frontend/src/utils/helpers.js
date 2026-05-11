export const getInitials = (name = "") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === "Done") return false;
  return new Date(dueDate).getTime() < Date.now();
};
