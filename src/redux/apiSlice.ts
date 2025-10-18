import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the shape of the login response, including the token
interface LoginResponse {
  token: string;
  user: any; // It's recommended to define a proper User type
}

/**
 * Tedics API Slice.
 *
 * This is the core of our data fetching logic with RTK Query.
 * It defines the base URL and prepares headers for authentication.
 * Endpoints are injected from other files to keep this file clean.
 */
export const tedicsApi = createApi({
  reducerPath: 'tedicsApi',
  baseQuery: fetchBaseQuery({
    // The base URL for all API requests.
    // It uses the VITE_API_URL from your .env file, with a fallback for development.
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    /**
     * Prepares the headers for each request.
     * If a token is found in localStorage, it adds the Authorization header.
     * This is how protected endpoints will be accessed.
     */
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // Tag types are used for caching and invalidation.
  tagTypes: ['Service', 'User', 'Quote', 'Product'],
  /**
   * Endpoints are defined in separate files and injected here.
   * This keeps the API slice organized.
   * For this initial setup, we define two example endpoints directly.
   */
  endpoints: (builder) => ({
    // Example of a public endpoint to fetch all services.
    getServices: builder.query<any[], void>({
      query: () => 'services',
      providesTags: ['Service'],
    }),
    // Example of a mutation endpoint for user login.
    login: builder.mutation<LoginResponse, any>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      /**
       * After a successful login, you can handle the response here.
       * A common pattern is to store the token in localStorage
       * and dispatch an action to update the user state.
       *
       * onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
       *   try {
       *     const { data } = await queryFulfilled;
       *     localStorage.setItem('token', data.token);
       *     // dispatch(setUser(data.user));
       *   } catch (error) {
       *     // Handle login error
       *   }
       * }
       */
    }),

    // Endpoint to fetch the current user's profile.
    getProfile: builder.query<any, void>({
      query: () => 'auth/me',
      providesTags: ['User'],
    }),

    // Endpoint to fetch all users/clients.
    getUsers: builder.query<Client[], void>({
      query: () => '/users',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    // Endpoint to fetch a single quote by ID.
    getQuoteById: builder.query<Quote, string>({
      query: (id) => `/quotations/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Quote', id }],
    }),

    // Endpoint to update a quote.
    updateQuote: builder.mutation<Quote, { id: string; payload: Partial<Quote> }>({
      query: ({ id, payload }) => ({
        url: `/quotations/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Quote', id }],
    }),
  }),
});

// --- Interface Definitions ---

export type QuoteStatus = 'PENDIENTE' | 'PRESUPUESTADA' | 'RECHAZADA' | 'APROBADA';

export interface Customer {
  id: string;
  name: string;
  email: string;
}

export interface Quote {
  id: string;
  customer: Customer;
  serviceName: string;
  description: string;
  status: QuoteStatus;
  presupuestoFinal?: number;
  notasAdministrativas?: string;
  createdAt: string;
}

// Define the Client interface based on the mock data
export interface Client {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isB2B: boolean;
}

// Export the auto-generated hooks for the example endpoints.
export const { 
  useGetServicesQuery, 
  useLoginMutation, 
  useGetProfileQuery, // <-- Export the new hook
  useGetUsersQuery,
  useGetQuoteByIdQuery,
  useUpdateQuoteMutation,
} = tedicsApi;
