import type { Member } from './members';


// Représente un compte bancaire
export type BankAccount = {
  id?: string;
  name: string;
  bankName: string;
  members: Member[];
  createdAt?: string;
  updatedAt?: string;
};

export type AddBankPayload ={
  name: string;
  bankName: string;
  members: string[]; // au lieu de { id: string }[]
}

// Représente une liste de banques
export type BankList = {
  value: string;
  label: string;
  logo: string;
}[];

export const banks: BankList = [
  {
    value: 'bnp-paribas',
    label: 'BNP Paribas',
    logo: 'https://cdn.brandfetch.io/idVor2XpLe/theme/dark/symbol.svg?c=1bxid64Mup7aczewSAYMX&t=1668518626253',
  },
  {
    value: 'banque-populaire',
    label: 'Banque Populaire',
    logo: 'https://cdn.brandfetch.io/idwB1lQNIs/theme/dark/symbol.svg?c=1bxid64Mup7aczewSAYMX&t=1684339845811',
  },
  {
    value: 'société-générale',
    label: 'Société Générale',
    logo: 'https://cdn.brandfetch.io/idhRX6wCyU/theme/dark/symbol.svg?c=1bxid64Mup7aczewSAYMX&t=1743435634263',
  },
  {
    value: 'credit-agricole',
    label: 'Crédit Agricole',
    logo: 'https://cdn.brandfetch.io/idVPrMdDmu/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1682683848862',
  },
  {
    value: 'cic',
    label: 'CIC',
    logo: 'https://cdn.brandfetch.io/idhPmjNj7s/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1684477840706',
  },
  {
    value: 'caisse-epargne',
    label: "Caisse d'Epargne",
    logo: 'https://cdn.brandfetch.io/id5uFQUQCp/w/357/h/357/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1752640591176',
  },
  {
    value: 'credit-mutuel',
    label: 'Crédit Mutuel',
    logo: 'https://cdn.brandfetch.io/idleIpDVgi/theme/dark/symbol.svg?c=1bxid64Mup7aczewSAYMX&t=1682686247177',
  },
  {
    value: 'lcl',
    label: 'LCL',
    logo: 'https://cdn.brandfetch.io/idiGfjSDMs/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1684495841029',
  },
  {
    value: 'la-banque-postale',
    label: 'La Banque Postale',
    logo: 'https://cdn.brandfetch.io/idGog1f-vH/theme/dark/symbol.svg?c=1bxid64Mup7aczewSAYMX&t=1682688655627',
  },
    {
    value: 'boursorama-banque',
    label: 'Boursorama Banque',
    logo: 'https://cdn.brandfetch.io/idrGtTxvao/w/1080/h/1080/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1751459655424',
  },
  {
    value: 'hello-bank',
    label: 'Hello bank!',
    logo: 'https://cdn.brandfetch.io/id82kGQ-di/theme/light/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1682875853355',
  },
  {
    value: 'fortuneo',
    label: 'Fortuneo',
    logo: 'https://cdn.brandfetch.io/idpngtT7uj/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1747725992828',
  },
  {
    value: 'monabanq',
    label: 'Monabanq',
    logo: 'https://cdn.brandfetch.io/idkzxtNfoe/w/375/h/375/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1752587789452',
  },
  {
    value: 'n26',
    label: 'N26',
    logo: 'https://cdn.brandfetch.io/idrMp227Ng/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1681661440866',
  },
    {
    value: 'revolut',
    label: 'Revolut',
    logo: 'https://cdn.brandfetch.io/idkTaHd18D/w/400/h/400/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1697548241418',
  },
  {
    value: 'nickel',
    label: 'Nickel',
    logo: 'https://cdn.brandfetch.io/idbhw90x6E/theme/dark/symbol.svg?c=1bxid64Mup7aczewSAYMX&t=1697212245140',
  },
  {
    value: 'qonto',
    label: 'Qonto',
    logo: 'https://cdn.brandfetch.io/iddTHt7H9X/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1667628466273',
  },
  {
    value: 'shine',
    label: 'Shine',
    logo: 'https://cdn.brandfetch.io/idxMC973v2/w/400/h/400/theme/dark/icon.png?c=1bxid64Mup7aczewSAYMX&t=1752416843370',
  }
];

