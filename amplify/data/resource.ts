import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/* Bike model
   - name: string
   - mileage: number (kilometers)
   - brand: string

   Authorization: owner-based (each user manages their own bikes)
*/
const schema = a.schema({
  Bike: a
    .model({
  name: a.string(),
  // mileage stored as string (kilometers). Use numeric type via codegen if needed.
  mileage: a.string(),
  brand: a.string(),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
