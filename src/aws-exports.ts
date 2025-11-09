import amplifyOutputs from '../amplify_outputs.json';

const auth = amplifyOutputs.auth ?? {};

const awsConfig = {
  Auth: {
    region: auth.aws_region,
    userPoolId: auth.user_pool_id,
    userPoolWebClientId: auth.user_pool_client_id,
    identityPoolId: auth.identity_pool_id,
    mandatorySignIn: false,
  },
  aws_appsync_graphqlEndpoint: amplifyOutputs.data?.url,
  aws_appsync_region: amplifyOutputs.data?.aws_region,
};

export default awsConfig;
