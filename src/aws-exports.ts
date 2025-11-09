import amplifyOutputs from '../amplify_outputs.json';

const auth = amplifyOutputs.auth ?? {};

// Build a legacy-style aws-exports shape that Amplify's runtime helpers can parse.
// This mirrors the keys created by Amplify so parseAWSExports/parseAmplifyConfig accept it.
const awsConfig = {
  // project/region
  aws_project_region: amplifyOutputs.data?.aws_region ?? auth.aws_region,

  // Cognito / Auth
  aws_cognito_region: auth.aws_region,
  aws_user_pools_id: auth.user_pool_id,
  aws_user_pools_web_client_id: auth.user_pool_client_id,
  aws_cognito_identity_pool_id: auth.identity_pool_id,

  // AppSync / Data
  aws_appsync_graphqlEndpoint: amplifyOutputs.data?.url,
  aws_appsync_region: amplifyOutputs.data?.aws_region,
  aws_appsync_authenticationType:
    amplifyOutputs.data?.default_authorization_type ??
    (amplifyOutputs.data?.api_key ? 'API_KEY' : 'AWS_IAM'),
  aws_appsync_apiKey: amplifyOutputs.data?.api_key,

  // Also include Auth config object for direct Amplify Auth configuration
  Auth: {
    region: auth.aws_region,
    userPoolId: auth.user_pool_id,
    userPoolWebClientId: auth.user_pool_client_id,
    identityPoolId: auth.identity_pool_id,
    mandatorySignIn: false,
  },
};

export default awsConfig;
