import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}
interface Request {
  title: string;

  value: number;

  type: 'income' | 'outcome';
}

enum Type {
  INCOME = 'income',
  OUTCOME = 'outcome',
}
class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  private calculateBalance(operator: Type): number {
    return this.transactions
      .filter(transaction => transaction.type === operator)
      .reduce((acc, transaction) => acc + transaction.value, 0);
  }

  public getBalance(): Balance {
    const income = this.calculateBalance(Type.INCOME);
    const outcome = this.calculateBalance(Type.OUTCOME);
    const total = income - outcome;

    const balance: Balance = { income, outcome, total };

    return balance;
  }

  public create({ title, value, type }: Request): Transaction {
    const transaction = new Transaction({ title, value, type });
    const { total } = this.getBalance();

    if (type === Type.OUTCOME && total < value) {
      throw Error('Cannot create outcome transaction without a valid balance');
    }

    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
