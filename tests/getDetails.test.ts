import getDetails from '../src/apis/getDetails.api'

test('should get details of msisdn',async () => {
  const msisdn = '277972514'

  const res = await getDetails(msisdn);
  console.log(res);
  expect(res).toBeDefined();
  
})