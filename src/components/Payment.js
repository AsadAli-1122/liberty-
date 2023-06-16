import { useEffect, useState } from 'react';
import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51NEByjDLz9qiBT59omfZcUPeY4QMC4ImcNGj9GFTkaLABVE2GuBq6ulBjsExVaSKN0BBFUjduEqemf78AbIUidrI006VUHpjf7');

const formatDescription = (booksData) => {
  let description = '';
  booksData.forEach((book) => {
    description += `Book name: ${book.booktitle} -- `;
    description += `price: UGX ${book.price} -- `;
    description += `Borrow Time: ${book.borrowTime} - ${book.borrowTimePeriod} -- `;
    description += `Time: ${book.time}  -//- `;
  });

  return description;
};

const Payment = ({ amountInUSD, onPaymentSuccess, booksData }) => {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Math.round(amountInUSD * 100), // Convert amount to cents
            currency: 'usd',
            description: formatDescription(booksData),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch client secret');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchClientSecret();
  }, [amountInUSD ,booksData]);

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm clientSecret={clientSecret} onPaymentSuccess={onPaymentSuccess} />
    </Elements>
  );
};

const CheckoutForm = ({ clientSecret, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: {
          // Include additional billing details if needed
        },
      },
    });

    if (result.error) {
      console.log(result.error.message);
    } else if (result.paymentIntent.status === 'succeeded') {
      const transactionId = result.paymentIntent.id;
      onPaymentSuccess(transactionId);
      
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col space-y-4 mt-2'>
      <label className='px-4' >
        <CardNumberElement className='border border-gray-500 focus:border-gray-600 py-2 px-2 rounded-md w-full' />
      </label>
      <label className='flex space-x-4 px-4'>
        <CardExpiryElement className='border border-gray-500 focus:border-gray-600 py-2 px-2 rounded-md w-40 ' />
        <CardCvcElement className='border border-gray-500 focus:border-gray-600 py-2 px-2 rounded-md w-40 ' />
      </label>
      <hr className='border-t border-black w-full' />
      <div className='flex justify-center items-center'>
      <button type='submit' disabled={!stripe} className='px-12 py-1 rounded-3xl bg-[#DE1212] hover:bg-[#980e0e] text-white font-semibold text-md w-fit'>Pay</button>
      </div>
    </form>
  );
};

export default Payment;
