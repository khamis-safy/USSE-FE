import { MatPaginatorIntl } from "@angular/material/paginator";

export function CustomPaginator(label) {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = label;

  return customPaginatorIntl;
}
