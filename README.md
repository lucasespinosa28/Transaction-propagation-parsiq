# Transaction-propagation-parsiq [demo video](https://youtu.be/q-wWc8AX5jY)
![Screenshot from 2021-11-06 01-35-52](https://user-images.githubusercontent.com/52639395/140606298-99b0cc0e-4c9c-48c1-ad87-09ed56b1db49.png)

### parsiq code
```sql
stream TransactionPropagation
from Transfers
where @from in watchAddress
process
   emit {@from,@to,@value,decimals: 18,symbol:"ETH",tx:@tx_hash}
end
```
### user data
![Screenshot from 2021-11-06 07-24-33](https://user-images.githubusercontent.com/52639395/140606348-59304131-c335-4693-9b91-5285a6f010e4.png)

### delivery channels
![Screenshot from 2021-11-06 07-27-42](https://user-images.githubusercontent.com/52639395/140606464-ddc7d1f9-b24e-4f34-82f8-6d99cbfa0a60.png)

### webhook
[webhook serverless function](https://github.com/lucasespinosa28/webhook-propagation)

### config
in `src/config.js` add your google sheets API and sheet id and the first address of propagation 
