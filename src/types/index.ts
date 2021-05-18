import React from 'react';

export interface PlaidAccount {
  id: string;
  name: string;
  mask: string;
  type: string;
  subtype: string;
  verification_status: string;
}

export interface PlaidInstitution {
  name: string;
  institution_id: string;
}

export interface PlaidLinkError {
  error_type: string;
  error_code: string;
  error_message: string;
  display_message: string;
}

export interface PlaidLinkOnSuccessMetadata {
  institution: PlaidInstitution;
  accounts: Array<PlaidAccount>;
  link_session_id: string;
}

export interface PlaidLinkOnExitMetadata {
  institution: null | PlaidInstitution;
  // see possible values for status at https://plaid.com/docs/link/web/#link-web-onexit-status
  status: null | string;
  link_session_id: string;
  request_id: string;
}

export interface PlaidLinkOnEventMetadata {
  error_type: null | string;
  error_code: null | string;
  error_message: null | string;
  exit_status: null | string;
  institution_id: null | string;
  institution_name: null | string;
  institution_search_query: null | string;
  mfa_type: null | string;
  // see possible values for view_name at https://plaid.com/docs/link/web/#link-web-onevent-view-name
  view_name: null | string;
  // see possible values for selection at https://plaid.com/docs/link/web/#link-web-onevent-selection
  selection: null | string;
  // ISO 8601 format timestamp
  timestamp: string;
  link_session_id: string;
  request_id: string;
}

interface CommonPlaidLinkOptions {
  // A function that is called when a user has successfully connecter an Item.
  // The function should expect two arguments, the public_key and a metadata object
  onSuccess: (
    public_token: string,
    metadata: PlaidLinkOnSuccessMetadata
  ) => void;
  // A callback that is called when a user has specifically exited Link flow
  onExit?: (
    error: null | PlaidLinkError,
    metadata: PlaidLinkOnExitMetadata
  ) => void;
  // A callback that is called when the Link module has finished loading.
  // Calls to plaidLinkHandler.open() prior to the onLoad callback will be
  // delayed until the module is fully loaded.
  onLoad?: () => void;
  // A callback that is called during a user's flow in Link.
  // See all values for eventName here https://plaid.com/docs/link/web/#link-web-onevent-eventName
  onEvent?: (eventName: string, metadata: PlaidLinkOnEventMetadata) => void;
}

export type PlaidLinkOptionsWithPublicKey = CommonPlaidLinkOptions & {
  // The public_key associated with your account; available from
  // the Plaid dashboard (https://dashboard.plaid.com)
  publicKey: string;
  // Provide a public_token to initialize Link in update mode.
  token?: string;
  // Displayed once a user has successfully linked their account
  clientName: string;
  // The Plaid API environment on which to create user accounts.
  env: string;
  // The Plaid products you wish to use, an array containing some of connect,
  // auth, identity, income, transactions, assets, liabilities
  product: Array<string>;
  // An array of countries to filter institutions
  countryCodes?: Array<string>;
  // A local string to change the default Link display language
  language?: string;
  // Your user's associated email address - specify to enable all Auth features.
  // Note that userLegalName must also be set.
  userEmailAddress?: string;
  // Your user's legal first and last name – specify to enable all Auth features.
  // Note that userEmailAddress must also be set.
  userLegalName?: string;
  // Specify a webhook to associate with a user.
  webhook?: string;
  linkCustomizationName?: string;
  accountSubtypes?: { [key: string]: Array<string> };
  oauthNonce?: string;
  oauthRedirectUri?: string;
  oauthStateId?: string;
  paymentToken?: string;
};

export type PlaidLinkOptionsWithLinkToken = CommonPlaidLinkOptions & {
  // Provide a link_token associated with your account. Create one
  // using the /link/token/create endpoint.
  token: string;
  // receivedRedirectUri is required on the second-initialization of link when using Link
  // with a redirect_uri to support OAuth flows.
  receivedRedirectUri?: string;
};

// Either the publicKey or the token field must be configured. The publicKey
// is deprecated so prefer to initialize Link with a Link Token instead.
export type PlaidLinkOptions =
  | PlaidLinkOptionsWithPublicKey
  | PlaidLinkOptionsWithLinkToken;

export type PlaidLinkPropTypes = PlaidLinkOptions & {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export interface Plaid {
  open: () => void;
  exit: (force?: boolean) => void;
  create: (config: PlaidLinkOptions) => Plaid;
  destroy: () => void;
}

declare global {
  interface Window {
    Plaid: Plaid;
  }
}
