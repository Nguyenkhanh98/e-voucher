interface IBehaviorLog {
  apiUrl: string;
  method: string;
}
export const AllowBehaviorLog: IBehaviorLog[] = [
  {
    apiUrl: '/users/update',
    method: 'PUT',
  },
  {
    apiUrl: '/users/create',
    method: 'POST',
  },
  {
    apiUrl: '/users',
    method: 'DELETE',
  },
  {
    apiUrl: '/voucher-types',
    method: 'POST',
  },
  {
    apiUrl: '/voucher-types',
    method: 'PUT',
  },
  {
    apiUrl: '/pss/voucher-types',
    method: 'POST',
  },
  {
    apiUrl: '/pss/voucher',
    method: 'POST',
  },
  {
    apiUrl: '/pss/voucher',
    method: 'PUT',
  },
  {
    apiUrl: '/products',
    method: 'POST',
  },
  {
    apiUrl: '/products',
    method: 'PUT',
  },
  {
    apiUrl: '/products',
    method: 'DELETE',
  },
  {
    apiUrl: '/admin/customer',
    method: 'POST',
  },
  {
    apiUrl: '/admin/customer',
    method: 'PUT',
  },
  {
    apiUrl: '/admin/customer',
    method: 'DELETE',
  },
  {
    apiUrl: '/campaign',
    method: 'POST',
  },
  {
    apiUrl: '/campaign',
    method: 'PUT',
  },
  {
    apiUrl: '/campaign',
    method: 'DELETE',
  },
  {
    apiUrl: '/auth/permissison',
    method: 'POST',
  },
  {
    apiUrl: '/auth/permissison',
    method: 'DELETE',
  },
];
