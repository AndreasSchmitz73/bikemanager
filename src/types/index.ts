// Typen für Amplify Outputs (amplify_outputs.json)
export interface AmplifyOutputs {
  auth: {
    user_pool_id: string;
    aws_region: string;
    user_pool_client_id: string;
    identity_pool_id: string;
    mfa_configuration?: string;
    mfa_methods?: string[];
    username_attributes?: string[];
    standard_required_attributes?: string[];
    password_policy?: {
      min_length: number;
      require_lowercase: boolean;
      require_numbers: boolean;
      require_symbols: boolean;
      require_uppercase: boolean;
    };
  };
  data: {
    url: string;
    aws_region: string;
    api_key?: string;
    default_authorization_type: 'AMAZON_COGNITO_USER_POOLS' | 'AWS_IAM' | 'API_KEY';
    authorization_types: string[];
    model_introspection: {
      version: number;
      models: {
        [key: string]: {
          name: string;
          fields: {
            [key: string]: {
              name: string;
              isArray: boolean;
              type: string;
              isRequired: boolean;
              attributes: any[];
            };
          };
        };
      };
    };
  };
  version: string;
}

// Bike Modell (entspricht dem Schema in amplify/data/resource.ts)
export interface Bike {
  id: string;
  name: string;
  mileage: string; // als string gespeichert
  brand: string;
  createdAt?: string;
  updatedAt?: string;
  owner?: string;
}

// Liste von Bikes mit Pagination
export interface BikeList {
  items: Bike[];
  nextToken?: string;
}