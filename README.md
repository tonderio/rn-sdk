# Tonder React Native SDK

Tonder React Native SDK helps integrate Tonder's payment services into your React Native application, providing secure and flexible payment processing capabilities.

## Table of Contents

- [Installation](#installation)
- [Requirements](#requirements)
- [Features](#features)
- [Secure token](#secure-token)
- [Usage](#usage)
  - [Provider Setup](#provider-setup)
  - [Full Payment Integration](#full-payment-integration)
  - [Lite Payment Integration](#lite-payment-integration)
  - [Card Enrollment Integration](#card-enrollment-integration)
- [Configuration](#configuration)
- [Components](#components)
- [API Reference](#api-reference)
- [Styling](#styling)
  - [Inline and Enrollment Styling](#inline--enrollment-styling)
  - [Lite Styling](#lite-styling)
- [Examples](#examples)

## Installation

```bash
npm install @tonder.io/rn-sdk
# OR
yarn add @tonder.io/rn-sdk
```

## Requirements
- react-native >= 0.70
- react >= 16.8
- react-native-svg >= 15.0.0
- react-native-webview >= 13.6.0

## Features

The SDK supports three integration types:

- `SDKType.INLINE`: Full payment UI with built-in components and features
  - Pre-built UI components
  - Saved cards management
  - Multiple payment methods support
  - Built-in error handling and validation
  - Customizable styling and layout

- `SDKType.LITE`: Individual components for custom UI implementations
  - Secure input components for custom payment forms
  - Card enrollment and management
  - Payment method handling
  - Card tokenization and storage
  - Card deletion capabilities
  - Manual payment flow control
  - Flexible UI customization
  - Direct access to all SDK features:
    - Payment processing
    - Card saving
    - Card listing
    - Card deletion
    - Payment methods retrieval

- `SDKType.ENROLLMENT`: Card saving functionality
  - Card tokenization
  - Card validation
  - Secure storage

Each type can be specified when initializing the SDK through the TonderProvider:

```tsx
// Full Payment UI
<TonderProvider
  config={{
    type: SDKType.INLINE,
    mode: 'development',
    apiKey: 'your-api-key',
  }}
>
  <YourApp />
</TonderProvider>

// Custom UI with Individual Components
<TonderProvider
  config={{
    type: SDKType.LITE,
    mode: 'development',
    apiKey: 'your-api-key',
  }}
>
  <YourApp />
</TonderProvider>

// Card Enrollment
<TonderProvider
  config={{
    type: SDKType.ENROLLMENT,
    mode: 'development',
    apiKey: 'your-api-key',
  }}
>
  <YourApp />
</TonderProvider>
```

## Secure token
For card-related operations (save, list, delete), you need a secure token. This should be obtained through your backend for security:

> **Important Note about SaveCard functionality**:
> To properly implement the SaveCard feature, you must use a SecureToken. For detailed implementation instructions and best practices, please refer to our official documentation on [How to use SecureToken for secure card saving](https://docs.tonder.io/integration/sdks/secure-token#how-to-use-securetoken-for-secure-card-saving).


**Important**: Never expose your API secret key in frontend code. It is recommended to implement token generation in your backend.

```typescript
const getSecureToken = async (apiSecretKey: string) => {
  const response = await fetch(
    `${TONDER_ENVIRONMENT_URL}/api/secure-token/`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Token ${'YOUR-SECRET-API-KEY'}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await response.json();
  return data.access;
};
```


## Usage

### Provider Setup

First, wrap your application or payment screen with the `TonderProvider`:

```tsx
import { TonderProvider, SDKType } from '@tonder.io/rn-sdk';

function App() {
  return (
    <TonderProvider
      config={{
        type: SDKType.INLINE,  // or SDKType.LITE or SDKType.ENROLLMENT
        mode: 'development', // or production
        apiKey: 'your-api-key',
      }}
    >
      <YourApp />
    </TonderProvider>
  );
}
```
### Full Payment Integration

The Full Payment integration provides a complete pre-built UI for payment processing
Before create the mobile SDK, your checkout page should:
- Obtain the security token for card functionalities (save, delete, list).
- Show the products being purchased and the total amount
- Collect any required customer information

```tsx
import {
  TonderPayment,
  useTonder,
  SDKType,
  IBaseProcessPaymentRequest
} from '@tonder.io/rn-sdk';

export default function FullPaymentScreen() {
  const { create, reset } = useTonder<SDKType.INLINE>();

  const paymentData: IBaseProcessPaymentRequest = {
    customer: {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    },
    cart: {
      total: 399,
      items: [{
        name: 'Product',
        amount_total: 399,
        description: 'Description',
        price_unit: 399,
        quantity: 1,
      }]
    }
  };

  useEffect(() => {
    initializePayment();
  }, []);

  const initializePayment = async () => {
    const { error } = await create({
      secureToken: 'your-secure-token',
      paymentData,
      callbacks: {
        onFinishPayment: handlePaymentFinish
      }
    });

    if (error) {
      console.error('SDK initialization error:', error);
    }
  };

  const callbackFinish = async (response) => {
    console.log('FINISH PAYMENT ===== ', response);

    // Reset the state and regenerate the SDK to use it again.
    reset();
    await initializePayment();
  };

  return (
    <SafeAreaView>
      <TonderPayment />
    </SafeAreaView>
  );
}
```

### Lite Payment Integration

The Lite Payment integration provides individual components for a custom payment UI.
Before create the mobile SDK, your checkout page should:
- Obtain the security token for card functionalities (save, delete, list).
- Show the products being purchased and the total amount
- Collect any required customer information

```tsx
import {
  CardHolderInput,
  CardNumberInput,
  CardExpirationMonthInput,
  CardExpirationYearInput,
  CardCVVInput,
  useTonder,
  SDKType
} from '@tonder.io/rn-sdk';

export default function LitePaymentScreen() {
  const { create, payment } = useTonder<SDKType.LITE>();

  const paymentData = {
    customer: {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    },
    cart: {
      total: 399,
      items: [{
        name: 'Product',
        amount_total: 399,
        description: 'Description',
        price_unit: 399,
        quantity: 1,
      }]
    }
  };

  useEffect(() => {
    initializePayment();
  }, []);

  const initializePayment = async () => {
    const { error } = await create({
      secureToken: 'your-secure-token',
      paymentData,
      customization: {
        saveCards: {
          autoSave: false,
        },
      },
    });

    if (error) {
      console.error('SDK initialization error:', error);
    }
  };

  const handlePayment = async () => {
    const { response, error } = await payment();
    if (error) {
      console.error('Payment error:', error);
      return;
    }
    console.log('Payment success:', response);
  };

  return (
    <SafeAreaView>
      <CardHolderInput />
      <CardNumberInput />
      <CardExpirationMonthInput />
      <CardExpirationYearInput />
      <CardCVVInput />
      <TouchableOpacity onPress={handlePayment}>
        <Text>Pay</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
```

### Card Enrollment Integration

For saving cards without processing payments.
Before create the mobile SDK, your checkout page should:
- Obtain the security token for card functionalities (save, delete, list).
- Collect any required customer information

```tsx
import {
  TonderEnrollment,
  useTonder,
  SDKType,
  ICustomer
} from '@tonder.io/rn-sdk';

export default function EnrollmentScreen() {
  const { create, reset } = useTonder<SDKType.ENROLLMENT>();

  const customerData: ICustomer = {
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe'
  };

  useEffect(() => {
    initializeEnrollment();
  }, []);

  const initializeEnrollment = async () => {
    const { error } = await create({
      secureToken: 'your-secure-token',
      customer: customerData,
      callbacks: {
        onFinishSave: handleSaveFinish
      }
    });

    if (error) {
      console.error('Enrollment initialization error:', error);
    }
  };

  const handleSaveFinish = async (response) => {
    console.log('Card saved successfully:', response);
    // Reset the state and regenerate the SDK to use it again
    reset();
    await initializeEnrollment();
  };

  return (
    <SafeAreaView>
      <TonderEnrollment />
    </SafeAreaView>
  );
}
```

### Card Enrollment Lite Integration

For saving cards with individual components, before create the mobile SDK, your checkout page should:
- Obtain the security token for card functionalities (save, delete, list).
- Collect any required customer information:

```tsx
import {
  CardHolderInput,
  CardNumberInput,
  CardExpirationMonthInput,
  CardExpirationYearInput,
  CardCVVInput,
  useTonder,
  SDKType,
  ICustomer
} from '@tonder.io/rn-sdk';

export default function EnrollmentLiteScreen() {
  const { create, saveCustomerCard, reset } = useTonder<SDKType.ENROLLMENT>();

  const customerData: ICustomer = {
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe'
  };

  useEffect(() => {
    initializeEnrollment();
  }, []);

  const initializeEnrollment = async () => {
    const { error } = await create({
      secureToken: 'your-secure-token',
      customer: customerData,
    });

    if (error) {
      console.error('Enrollment initialization error:', error);
    }
  };

  const handleSaveCard = async () => {
    try {
      const { response, error } = await saveCustomerCard();
      if (error) {
        console.error('Error saving card:', error);
        return;
      }
      console.log('Card saved successfully:', response);

      // Reset and reinitialize for next use
      reset();
      await initializeEnrollment();
    } catch (e) {
      console.error('Unexpected error:', e);
    }
  };

  return (
    <SafeAreaView>
          <CardHolderInput />
          <CardNumberInput />
          <CardExpirationMonthInput />
          <CardExpirationYearInput />
          <CardCVVInput />
          <TouchableOpacity
            onPress={handleSaveCard}
          >
              <Text>Save Card</Text>
          </TouchableOpacity>
    </SafeAreaView>
  );
}
```


## Configuration

### Base Configuration

| Property  | Type                                       | Required | Description                                     |
|-----------|--------------------------------------------|----------|-------------------------------------------------|
| mode      | 'development' \| 'production' \| 'sandbox' | Yes      | Environment mode for the SDK                    |
| apiKey    | string                                     | Yes      | Your Tonder Public API key                      |
| type      | SDKType                                    | Yes      | Integration type (INLINE or LITE or ENROLLMENT) |
| returnURL | string                                     | No       | URL for 3DS redirect completion                 |

<details>
<summary>View Interface Definition</summary>

```typescript
interface ISDKBaseConfig {
  mode: 'development' | 'production' | 'sandbox';
  apiKey: string;
  type: SDKType;
  returnURL?: string;
}
```
</details>

### Inline Options
Provide this information when calling the create function.

| Option        | Type                        | Required | Description                                          |
|---------------|-----------------------------|----------|------------------------------------------------------|
| paymentData   | IBaseProcessPaymentRequest  | Yes      | Payment information including customer and cart data |
| customization | IInlineCustomizationOptions | No       | UI customization options                             |
| callbacks     | IInlineCallbacks            | No       | Payment process callback functions                   |
| returnURL     | string                      | No       | URL for 3D Secure redirect completion                |

<details>
<summary>View IInlineCheckoutOptions Interface</summary>

```typescript
interface IInlineCheckoutOptions extends IBaseCreateOptions {
  paymentData: IBaseProcessPaymentRequest;
  customization?: IInlineCustomizationOptions;
  callbacks?: IInlineCallbacks;
  returnURL?: string;
}
```
</details>


### Lite Options
Provide this information when calling the create function.

| Option        | Type                      | Required | Description                                          |
|---------------|---------------------------|----------|------------------------------------------------------|
| paymentData   | IProcessPaymentRequest    | Yes      | Payment information including customer and cart data |
| customization | ILiteCustomizationOptions | No       | UI customization options                             |
| callbacks     | ILiteCallbacks            | No       | Payment process callback functions                   |
| returnURL     | string                    | No       | URL for 3D Secure redirect completion                |

<details>
<summary>View IInlineCheckoutOptions Interface</summary>

```typescript
interface ILiteCheckoutOptions extends IBaseCreateOptions {
  paymentData: IProcessPaymentRequest;
  customization?: ILiteCustomizationOptions;
  callbacks?: ILiteCallbacks;
  returnURL?: string;
}
```
</details>

### Enrollment Options
Provide this information when calling the create function.

| Option        | Type                            | Required | Description                           |
|---------------|---------------------------------|----------|---------------------------------------|
| customer      | ICustomer                       | Yes      | Customer information                  |
| customization | IEnrollmentCustomizationOptions | No       | UI customization options              |
| callbacks     | IEnrollmentCallbacks            | No       | Enrollment process callback functions |

<details>
<summary>View IInlineCheckoutOptions Interface</summary>

```typescript
export interface IEnrollmentOptions extends IBaseCreateOptions {
  customer?: ICustomer;
  customization?: IEnrollmentCustomizationOptions;
  callbacks?: IEnrollmentCallbacks;
}
```
</details>

### Inline Callbacks Structure

| Callback             | Parameters                              | Description                                                                                                                                        | Return        |
|----------------------|-----------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| `beforePayment`      | none                                    | Called before the payment process begins. You can use this to show a loading state, validate additional data, or perform any pre-payment tasks.    | Promise<void> |
| `onFinishPayment`    | `response: IBaseResponse<ITransaction>` | Called when the payment process completes (success or error). Provides the transaction result or error details.                                    | Promise<void> |
| `beforeDeleteCard`   | none                                    | Called before the delete card process begins. You can use this to show a loading state, validate additional data, or perform any pre-delete tasks. | Promise<void> |
| `onFinishDeleteCard` | `response: IBaseResponse<string>`       | Called when the delete card process completes (success or error).                                                                                  | Promise<void> |

<details>
<summary>View Callback Interface</summary>

```typescript

export interface IInlineCallbacks {
  beforePayment?: () => Promise<void>;
  onFinishPayment?: (response: IBaseResponse<ITransaction>) => Promise<void>;
  beforeDeleteCard?: () => Promise<void>;
  onFinishDeleteCard?: (response: IBaseResponse<string>) => Promise<void>;
}
```
</details>

### Lite Callbacks Structure

| Callback             | Parameters                              | Description                                                                                                                                     | Return        |
|----------------------|-----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| `beforePayment`      | none                                    | Called before the payment process begins. You can use this to show a loading state, validate additional data, or perform any pre-payment tasks. | Promise<void> |
| `onFinishPayment`    | `response: IBaseResponse<ITransaction>` | Called when the payment process completes (success or error). Provides the transaction result or error details.                                 | Promise<void> |

<details>
<summary>View Callback Interface</summary>

```typescript

export interface ILiteCallbacks {
  beforePayment?: () => Promise<void>;
  onFinishPayment?: (response: IBaseResponse<ITransaction>) => Promise<void>;
}
```
</details>

### Enrollment Callbacks Structure

| Callback       | Parameters                                   | Description                                                                                                                                         | Return        |
|----------------|----------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| `beforeSave`   | none                                         | Called before the save card process begins. You can use this to show a loading state, validate additional data, or perform any pre-save-card tasks. | Promise<void> |
| `onFinishSave` | `response: IBaseResponse<ISaveCardResponse>` | Called when the save card process completes (success or error). Provides the transaction result or error details.                                   | Promise<void> |

<details>
<summary>View Callback Interface</summary>

```typescript

export interface IEnrollmentCallbacks {
  beforeSave?: () => Promise<void>;
  onFinishSave?: (response: IBaseResponse<ISaveCardResponse>) => Promise<void>;
}
```
</details>

### Payment Data Structure

#### Customer Information

| Field     | Type   | Required | Description                     |
|-----------|--------|----------|---------------------------------|
| email     | string | Yes      | Customer's email address        |
| firstName | string | Yes      | Customer's first name           |
| lastName  | string | Yes      | Customer's last name            |
| phone     | string | No       | Customer's contact phone number |
| address   | string | No       | Customer's street address       |
| city      | string | No       | Customer's city                 |
| state     | string | No       | Customer's state/province       |
| country   | string | No       | Customer's country              |
| postCode  | string | No       | Customer's postal/ZIP code      |

#### Cart Information

| Field    | Type                | Required | Description                                |
|----------|---------------------|----------|--------------------------------------------|
| total    | number              | Yes      | Total amount of the transaction            |
| items    | Array&lt;IItem&gt;  | Yes      | Array of items in the cart                 |
| metadata | Record<string, any> | No       | Additional custom data for the transaction |
| currency | string              | No       | Currency code (default: MXN)               |

#### Cart Item Structure

| Field             | Type   | Required | Description                                   |
|-------------------|--------|----------|-----------------------------------------------|
| name              | string | Yes      | Product name                                  |
| amount_total      | number | Yes      | Total amount for this item (quantity × price) |
| description       | string | Yes      | Product description                           |
| price_unit        | number | Yes      | Unit price of the product                     |
| product_reference | string | Yes      | Unique identifier for the product             |
| quantity          | number | Yes      | Number of units                               |
| discount          | number | No       | Discount amount applied                       |
| taxes             | number | No       | Tax amount applied                            |


#### Additional fields for LITE VERSION

| Field          | Type   | Required | Description                              |
|----------------|--------|----------|------------------------------------------|
| card           | string | no       | The ID of the card selected by the user. |
| payment_method | string | no       | The payment method selected by the user. |

<details>

<summary>View Complete Payment Data Interface</summary>

```typescript
// FOR INLINE VERSION
interface IBaseProcessPaymentRequest {
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postCode?: string;
  };
  cart: {
    total: number;
    items: Array<{
      name: string;
      amount_total: number;
      description: string;
      price_unit: number;
      product_reference: string;
      quantity: number;
      discount?: number;
      taxes?: number;
    }>;
  };
  metadata?: Record<string, any>;
  currency?: string;
}

// FOR LITE VERSION
interface IProcessPaymentRequest {
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postCode?: string;
  };
  cart: {
    total: number;
    items: Array<{
      name: string;
      amount_total: number;
      description: string;
      price_unit: number;
      product_reference: string;
      quantity: number;
      discount?: number;
      taxes?: number;
    }>;
  };
  metadata?: Record<string, any>;
  currency?: string;
  card?: string;
  payment_method?: string;
}
```
</details>


### Customization Options for Inline Version

| Option                       | Type    | Default | Description                                                                               |
|------------------------------|---------|---------|-------------------------------------------------------------------------------------------|
| **saveCards**                |
| saveCards.showSaveCardOption | boolean | true    | Shows a checkbox allowing users to choose whether to save their card for future purchases |
| saveCards.showSaved          | boolean | true    | Displays a list of previously saved cards for the customer                                |
| saveCards.autoSave           | boolean | false   | Automatically saves the card without showing the save option to the user                  |
| saveCards.showDeleteOption   | boolean | true    | Shows a delete button for each saved card in the list                                     |
| **paymentButton**            |
| paymentButton.show           | boolean | true    | Controls the visibility of the payment button                                             |
| paymentButton.text           | string  | 'Pagar' | Custom text to display on the payment button                                              |
| paymentButton.showAmount     | boolean | true    | Shows the payment amount on the button (e.g., "Pay $100")                                 |
| **paymentMethods**           |
| paymentMethods.show          | boolean | true    | Controls the visibility of alternative payment methods section                            |
| **cardForm**                 |
| cardForm.show                | boolean | true    | Controls the visibility of the card input form                                            |
| **General**                  |
| showMessages                 | boolean | true    | Controls the visibility of error and success messages                                     |
| labels                       | object  | -       | Custom labels for form fields (see Form Labels)                                           |
| placeholders                 | object  | -       | Custom placeholder text for form inputs (see Form Placeholders)                           |
| styles                       | object  | -       | Custom styles for UI components (see Styling section)                                     |

<details>
<summary>View Interface Definition</summary>

```typescript
interface IInlineCustomizationOptions {
  saveCards?: {
    showSaveCardOption?: boolean;
    showSaved?: boolean;
    autoSave?: boolean;
    showDeleteOption?: boolean;
  };
  paymentButton?: {
    show?: boolean;
    text?: string;
    showAmount?: boolean;
  };
  paymentMethods?: {
    show?: boolean;
  };
  cardForm?: {
    show?: boolean;
  };
  showMessages?: boolean;
  labels?: IFormLabels;
  placeholders?: IFormPlaceholder;
  styles?: IStyles;
}
```
</details>


### Customization Options for Lite Version

| Option                       | Type    | Default | Description                                                                               |
|------------------------------|---------|---------|-------------------------------------------------------------------------------------------|
| **saveCards**                |
| saveCards.autoSave           | boolean | false   | Automatically saves the card without showing the save option to the user                  |

<details>
<summary>View Interface Definition</summary>

```typescript
interface ILiteCustomizationOptions {
  saveCards?: {
    autoSave?: boolean;
  };
}
```
</details>

### Customization Options for Enrollment Version

| Option          | Type    | Default   | Description                                                     |
|-----------------|---------|-----------|-----------------------------------------------------------------|
| **saveButton**  |
| saveButton.show | boolean | true      | Controls the visibility of the save button                      |
| saveButton.text | string  | 'Guardar' | Custom text to display on the save button                       |
| **General**     |
| showMessages    | boolean | true      | Controls the visibility of error and success messages           |
| labels          | object  | -         | Custom labels for form fields (see Form Labels)                 |
| placeholders    | object  | -         | Custom placeholder text for form inputs (see Form Placeholders) |
| styles          | object  | -         | Custom styles for UI components (see Styling section)           |

<details>
<summary>View Interface Definition</summary>

```typescript
interface IEnrollmentCustomizationOptions {
  paymentButton?: {
    show?: boolean;
    text?: string;
  };
  showMessages?: boolean;
  labels?: IFormLabels;
  placeholders?: IFormPlaceholder;
  styles?: IStyles;
}
```
</details>

### Form Labels & Placeholders

These options allow you to customize the text of the labels and placeholders for the form fields.
> **Note:** For the Lite version, you can pass the respective values directly when using Tonder's inputs.


#### Form Labels
Customization of field labels:

| Property              | Type   | Default                              | Description                                                           |
|-----------------------|--------|--------------------------------------|-----------------------------------------------------------------------|
| name                  | string | "Titular de la tarjeta"              | Label for the cardholder's name field.                                |
| cardNumber            | string | "Número de tarjeta"                  | Label for the card number field.                                      |
| cvv                   | string | "CVV"                                | Label for the security code field.                                    |
| expiryDate            | string | "Fecha de expiración"                | Label for the expiration date fields.                                 |
| saveCardFuturePayment | string | "Guardar tarjeta para futuros pagos" | Label for the save card for future payments.                          |
| saveCardCheckedIcon   | string | "✓"                                  | Label for checked icon of the save card for future payments checkbox. |
| expirationCard        | string | "Exp."                               | Label for the expiration card text.                                   |
| payWithCard           | string | "Pagar con tarjeta"                  | Label for pay with card option.                                       |


<details>
<summary>View Form Labels Interface</summary>

```typescript
interface IFormLabels {
 name?: string;
 cardNumber?: string;
 cvv?: string;
 expiryDate?: string;
 saveCardFuturePayment?: string;
 saveCardCheckedIcon?: string;
 expirationCard?: string;
 payWithCard?: string;
}
```
</details>

#### Form Placeholders
Customization of field placeholder:

| Property    | Type   | Default                             | Description                                  |
|-------------|--------|-------------------------------------|----------------------------------------------|
| name        | string | "Nombre como aparece en la tarjeta" | Placeholder for the cardholder's name field. |
| cardNumber  | string | "1234 1234 1234 1234"               | Placeholder for the card number field.       |
| cvv         | string | "3-4 dígitos"                       | Placeholder for the security code field.     |
| expiryMonth | string | "MM"                                | Placeholder for the expiration month field.  |
| expiryYear  | string | "AA"                                | Placeholder for the expiration year field.   |

<details>
<summary>View Form Placeholders Interface</summary>

```typescript
interface IFormPlaceholder {
 name?: string;
 cardNumber?: string;
 cvv?: string;
 expiryMonth?: string;
 expiryYear?: string;

}
```
</details>


## Components

### Pre-built Components

The SDK provides two main pre-built components for full integrations:

- **TonderPayment**: Complete payment form with built-in card management, payment methods, and validations (INLINE)
- **TonderEnrollment**: Complete card enrollment form for saving cards (ENROLLMENT)

### Individual Components

All individual components are available for LITE integrations. Each component includes built-in validations and secure data handling:
- CardCVVInput
- CardHolderInput
- CardNumberInput
- CardExpirationDateInput
- CardExpirationMonthInput
- CardExpirationYearInput

## API Reference

### Hook: useTonder
The SDK provides a custom hook for accessing SDK functionality based on the integration type.

```typescript
const sdk = useTonder<SDKType>();
```

### Common Methods

All SDK integrations (INLINE, LITE, ENROLLMENT) share these base methods:

- create: Initializes the SDK with configuration.
- reset: Resets the SDK state to its initial values and cleans up resources.

```typescript
const {create, reset} = useTonder<SDKType>();
```

### INLINE SDK Methods
The INLINE integration provides methods for handling full payment processing with built-in UI components.
- payment: Processes a payment using the configured payment data.
```typescript
const {create, payment, reset } = useTonder<SDKType.INLINE>();
```

> **Note:** The payment function It is only necessary when you want to control the payment button on your own.
> **Additionally, if there are any changes to the payment or customer data, you can pass the updated data again when calling the function**.

> **Note:** For card methods, it is necessary to obtain and use your secure token when calling the create function.

#### Example with custom payment button

```tsx
export default function FullPaymentButtonScreen() {
  const { create, payment } = useTonder<SDKType.INLINE>();

  useEffect(() => {
    createSDK()
  }, [])

  const createSDK = async () => {
    const { error } = await create({
      secureToken: 'your-secure-token',
      paymentData: { ...paymentData },
      customization: {
        paymentButton: {
          show: false, // hide default button
        },
      },
    });

    if (error) {
      // Manage error
      console.error('Error creating SDK', error);
    }
  };

  const handlePayment = async () => {
    const { response, error } = await payment();

    if (error) {
      console.error('Error payment: ', error);
      return;
    }
    console.log('Response payment: ', response);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <TonderPayment />
        {/*Custom button*/}
        <TouchableOpacity onPress={handlePayment}>
           <Text>Pagar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
```

### LITE SDK Methods

The LITE integration provides full control over the payment flow with individual components and direct access to all SDK functionalities.

- payment: Processes a payment using the configured payment data.
- saveCustomerCard: Tokenizes and saves the current card information.
- getCustomerCards: Retrieves the list of saved cards for the customer.
- getPaymentMethods: Retrieves available payment methods.
- removeCustomerCard: Deletes a saved card.

> **Note**: If there are any changes to the payment or customer data, you can pass the updated data again when calling the payment function**.

> **Note:** For card methods, it is necessary to obtain and use your secure token when calling the create function.

```typescript
const { create, payment, saveCustomerCard, getCustomerCards,
        removeCustomerCard, getPaymentMethods, reset } = useTonder<SDKType.LITE>();
```

### Enrollment SDK Methods

The ENROLLMENT integration provides methods for handling full enrollment with built-in UI components.

- saveCustomerCard: Tokenizes and saves the current card information.

> **Note:** The saveCustomerCard It is only necessary when you want to control the enrollment button on your own.

> **Note:** For card methods, it is necessary to obtain and use your secure token when calling the create function.

```typescript
const { create, saveCustomerCard, reset } = useTonder<SDKType.LITE>();
```
#### Example with custom button
```tsx

export default function EnrollmentButtonScreen() {
  const { create, saveCustomerCard } = useTonder<SDKType.ENROLLMENT>();

  useEffect(() => {
    createSDK()
  }, [])

  const createSDK = async (token) => {
    const { error } = await create({
      secureToken: token,
      customer: { ...customerData },
      customization: {
        saveButton: {
          show: false, // hidde default button
        },
      },
    });

    if (error) {
      // Manage error
      console.error('Error creating SDK', error);
    }
  };

  const handleSaveCard = async () => {
    const { response, error } = await saveCustomerCard();
    if (error) {
      //Manage error
      console.error('Error save: ', error);
      return;
    }
    console.log('Response save: ', response);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        <TonderEnrollment />
        {/*Custom button*/}
        <TouchableOpacity
          onPress={handleSaveCard}
        >
          <Text>Guardar</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
}
```


### Styling

The SDK provides flexible styling options to customize the appearance of the components.

> **Note:** For the Lite version, you can pass the respective values directly when using Tonder's inputs.

<details>
<summary>View Interface</summary>

```typescript
export interface IStyles {
  sdkCard?: StylesBaseVariant;
  cardForm?: StylesBaseVariant & IElementStyle;
  paymentMethods?: StylesSelectVariant;
  savedCards?: StylesSavedCardsVariant;
  paymentRadio?: StylesSelectVariant;
  paymentButton?: StylesBaseVariant;
  errorMessage?: StylesBaseVariant;
  successMessage?: StylesBaseVariant;
}
```
</details>

### Inline & Enrollment Styling

The style customization for Full integrations (INLINE and ENROLLMENT) is done through a styles object in the SDK configuration.

| Component          | Description               | Properties                                                                                                                                                                                                                                                        |
|--------------------|---------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **sdkCard**        | Main container of the SDK | `base`: StylesBaseVariant                                                                                                                                                                                                                                         |
| **cardForm**       | Card form section         | - `base`: StylesBaseVariant<br>- `inputStyles`: CollectInputStylesVariant<br>- `labelStyles`: CollectInputStylesVariant<br>-  `errorStyles`:StylesBaseVariant<br>-  `saveCardOption`:StylesCheckboxVariant                                                        |
| **savedCards**     | Saved cards list section  | - `base`: StylesBaseVariant<br>- `radioBase`: StylesBaseVariant<br>- `radioInner`: StylesBaseVariant<br>-   `radioSelected`: StylesBaseVariant<br>-   `cardIcon`: StylesBaseVariant<br>-   `deleteButton`: StylesBaseVariant<br>-`deteleIcon`:  StylesBaseVariant |
| **paymentMethods** | Payment methods section   | - `base`: StylesBaseVariant<br>- `radioBase`: StylesBaseVariant<br>- `radioInner`: StylesBaseVariant<br>-   `radioSelected`: StylesBaseVariant<br>                                                                                                                |
| **paymentRadio**   | Payment method selector   | - `base`: StylesBaseVariant<br>- `radioBase`: StylesBaseVariant<br>- `radioInner`: StylesBaseVariant<br>-   `radioSelected`: StylesBaseVariant<br>                                                                                                                |
| **paymentButton**  | Payment button            | `base`: StylesBaseVariant                                                                                                                                                                                                                                         |
| **errorMessage**   | Error message display     | `base`: TextStyle                                                                                                                                                                                                                                                 |
| **successMessage** | Success message display   | `base`: TextStyle                                                                                                                                                                                                                                                 |
| **skeletonCard**   | Skeleton                  | - `base`: StylesBaseVariant<br>- `fullField`: StylesBaseVariant<br>- `compactField`: StylesBaseVariant<br>-   `compactRow`: StylesBaseVariant<br>-   `animatedBGColors`: [string, string]<br>                                                                     |

#### Full customization example

```typescript
const styles = {
  sdkCard: {
    base: {
      backgroundColor: '#f9f9f9',
      borderRadius: 10,
      padding: 16,
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    },
  },
  cardForm: {
    base: {
      backgroundColor: '#ffffff',
      borderRadius: 10,
      padding: 16,
      borderWidth: 1,
      borderColor: '#e3e3e3',
      marginVertical: 8,
    },
    inputStyles: {
      base: {
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 6,
        padding: 12,
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
      },
    },
    labelStyles: {
      base: {
        fontSize: 14,
        color: '#666',
        marginBottom: 6,
      },
    },
    saveCardOption: {
      base: {
        marginTop: 15,
        color: '#4a4a4a',
      },
      checkboxBase: {
        borderColor: '#4a4a4a',
      },
      checkboxCheckedBase: {
        backgroundColor: '#35c6c1',
      },
      checkedIcon: {
        color: '#2c2929',
      },
    },
  },
  savedCards: {
    base: {
      backgroundColor: '#f9f9f9',
      borderRadius: 8,
      padding: 10,
      marginVertical: 6,
      borderWidth: 1,
      borderColor: '#e3e3e3',
    },
    cardItem: {
      base: {
        borderBottomColor: '#e2e8f0',
      },
    },
  },
  paymentRadio: {
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#f9f9f9',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#e3e3e3',
    },
  },
  paymentButton: {
    base: {
      backgroundColor: '#007AFF',
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      fontSize: 18,
      color: '#fff',
      fontWeight: '600',
    },
  },
  paymentMethods: {
    base: {
      paddingVertical: 10,
      backgroundColor: '#f9f9f9',
    },
    radioBase: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: '#007AFF',
      marginHorizontal: 10,
    },
  },
  successMessage: {
    base: {
      color: '#28a745',
      fontWeight: '600',
      fontSize: 16,
      textAlign: 'center',
      marginTop: 20,
    },
  },
  errorMessage: {
    base: {
      color: '#9a0832',
      fontWeight: '600',
      fontSize: 16,
      textAlign: 'center',
      marginTop: 20,
    },
  },
  skeletonCard: {
    base: {
      backgroundColor: '#F9F9F9',
    },
    fullField: {
      base: {
        borderRadius: 8,
      },
    },
    animatedBGColors: ['#e0e0e0', '#c8c7c7'],
  },
};

const { create } = useTonder<SDKType.INLINE>();

 const { error } = await create({
      secureToken: 'your-secure-token',
      paymentData: { ...paymentData },
      customization: {
        saveCards: {
          showSaveCardOption: true,
          showSaved: true,
        },
        paymentButton: {
          show: true,
          showAmount: false,
        },
        labels: {
          name: 'Cardholder Name',
          cvv: 'CVV',
          cardNumber: 'Card Number',
          expiryDate: 'Expiration Date',
        },
        placeholders: {
          cvv: '123',
          name: 'John Doe',
          cardNumber: '4242 4242 4242 4242',
          expiryMonth: 'MM',
          expiryYear: 'YY',
        },
        styles: styles,
      },
      callbacks: {
        onFinishPayment: callbackFinish,
      },
    });
```

### Lite Styling

The individual components of the LITE integration accept custom styles through the style prop. Each component can be styled independently

<details>
<summary>View Interface</summary>

```typescript
export interface InputProps {
  label?: string;
  placeholder?: string;
  style?: IElementStyle;
}
interface IElementStyle {
  inputStyles: {
    base?: ViewStyle & TextStyle;
    focus?: Record<string, any>;
    complete?: Record<string, any>;
    invalid?: Record<string, any>;
    empty?: Record<string, any>;
    container?: Record<string, any>;
  };
  labelStyles: {
    base?: TextStyle;
    requiredAsterisk?: Record<string, any>;
    focus?: Record<string, any>;
  };
  errorStyles?: {
    base: TextStyle;
  };
}
```
</details>

#### Lite customization example

```tsx
  <CardNumberInput
    placeholder="1234 5678 9012 3456"
    style={{
      inputStyles,
      labelStyles,
      errorStyles
    }}
  />

const inputStyles = {
  base: {
    backgroundColor: 'transparent',
    borderBottomColor: '#cbd5e1',
    borderBottomWidth: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: '#111827',
    marginBottom: 15,
  },
  focus: {
    borderBottomColor: '#0ea5e9',
    boxShadow: '0 0 0 4px rgba(14, 165, 233, 0.2)',
  },
};

const labelStyles = {
  base: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 5,
  },
};

const errorStyles = {
  base: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
};
```

## Examples
Check the /example directory in the repository for complete implementation examples:
- Full Payment Implementation
- Lite Payment Implementation
- Card Enrollment Implementation
- Examples with custom configurations and styles
