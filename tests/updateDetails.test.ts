import updateDetail from '../src/apis/updateDetails.api';


test('should update next of kin details',async () => {
  const input ={
    msisdn: '277972514',
    kinFirstName: 'Hello',
    kinLastName:'Solutions',
    kinDob:'10021998',
    kinMsisdn:'277972514',
    kinIdNumber:'2223333333'
  }
  const result = await updateDetail(input);
  
})