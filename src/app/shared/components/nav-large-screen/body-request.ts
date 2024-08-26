export const categoriseBodyPayload = {
  columns: [
    {
      name: 'id',
      title: 'id',
      searchable: false,
      orderable: true,
    },
    {
      name: 'name',
      title: 'name',
      searchable: true,
      orderable: false,
    },
  ],
  order: [{ column: 0, dir: 'asc' }],
  start: 0,
  length: 8,
  search: { value: null, regex: false },
};
