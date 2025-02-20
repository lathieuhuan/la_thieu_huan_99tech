interface WalletBalance {
  currency: string;
  amount: number;
  // Missing property 'blockchain' because I saw it used below
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

// If this Props is not going to be exported (must be renamed then), we should directly use BoxProps
interface Props extends BoxProps {

}
// Should not use React.FC, especially when children is unused
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // I would see if there is a better type for blockchain. It should be string I guess
	const getPriority = (blockchain: any): number => {
    // I would personally use a map
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}

  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
      // I think 'lhsPriority' should be 'balancePriority' because 'lhsPriority' is no where to find
      // and 'balancePriority' is unused and typeof number.
      // This whole condition checking can be done in one clean line.
		  if (lhsPriority > -99) {
		    if (balance.amount <= 0) {
		      return true;
		    }
		  }
		  return false
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
      // This sort function can be done in one clean line.
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }
    });
  }, [balances, prices]);

  // This is unused, and formatting can be done inside the below map callback.
  // So FormattedWalletBalance is redundant.
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}