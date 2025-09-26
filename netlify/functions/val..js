exports.handler = async function(event, context) {
  const { pin } = JSON.parse(event.body || '{}');

  const VALID_PIN = process.env.PIN_CODE;

  if (!pin || pin !== VALID_PIN) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid PIN' })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Access Granted' })
  };
};