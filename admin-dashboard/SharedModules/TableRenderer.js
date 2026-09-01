const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const tableActionHandlers = new WeakMap();
const tablesWithActionListeners = new WeakSet();

export function formatDate(dateValue) {
  if (!dateValue) return "-";

  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? "-" : dateFormatter.format(date);
}

export function createTableCell(content) {
  const cell = document.createElement("td");

  if (content instanceof Node) {
    cell.append(content);
  } else {
    cell.textContent = content ?? "-";
  }

  return cell;
}

export function showTableMessage(tableBody, message, columnCount) {
  const row = document.createElement("tr");
  const cell = createTableCell(message);
  cell.colSpan = columnCount;
  cell.className = "empty-state";
  row.append(cell);
  tableBody.replaceChildren(row);
}

function createTableRow(item, columns) {
  const row = document.createElement("tr");

  for (const column of columns) {
    const content = column.render
      ? column.render(item)
      : column.value?.(item);

    row.append(createTableCell(content));
  }

  return row;
}

export function renderTableRows(tableBody, items, columns) {
  const rowsFragment = document.createDocumentFragment();

  for (const item of items) {
    rowsFragment.append(createTableRow(item, columns));
  }

  tableBody.replaceChildren(rowsFragment);
}

export function attachTableActionHandler(tableBody, actionHandlers) {
  tableActionHandlers.set(tableBody, actionHandlers);

  if (tablesWithActionListeners.has(tableBody)) return;
  tablesWithActionListeners.add(tableBody);

  tableBody.addEventListener("click", async (event) => {
    if (!(event.target instanceof Element)) return;

    const button = event.target.closest("button[data-action][data-id]");
    if (!button || !tableBody.contains(button)) return;

    const handler = tableActionHandlers.get(tableBody)?.[button.dataset.action];
    if (typeof handler === "function") {
      await handler({ id: button.dataset.id, button, event });
    }
  });
}
