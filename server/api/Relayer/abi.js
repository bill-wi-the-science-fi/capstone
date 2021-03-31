module.exports = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_to',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_contract',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'Award_Deactivated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_to',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_contract',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'Award_Distributed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_to',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_contract',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'Award_Goal_Reached',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_from',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_contract',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'Emit_Funds_Donated',
    type: 'event'
  },
  {
    stateMutability: 'nonpayable',
    type: 'fallback'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'allAwards',
    outputs: [
      {
        internalType: 'address payable',
        name: 'recipientAddress',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'donationLimit',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'donationTotal',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'nominatorAddress',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'expires',
        type: 'uint256'
      },
      {
        internalType: 'bool',
        name: 'active',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    stateMutability: 'payable',
    type: 'receive',
    payable: true
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_awardId',
        type: 'uint256'
      }
    ],
    name: 'donateFunds',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
    payable: true
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_awardId',
        type: 'uint256'
      },
      {
        internalType: 'address payable',
        name: '_recipientAddress',
        type: 'address'
      }
    ],
    name: 'startAwardAndDonate',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
    payable: true
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_awardId',
        type: 'uint256'
      },
      {
        internalType: 'address payable',
        name: '_recipientAddress',
        type: 'address'
      }
    ],
    name: 'setRecipient',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_awardId',
        type: 'uint256'
      }
    ],
    name: 'expireAward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_awardId',
        type: 'uint256'
      }
    ],
    name: 'deactivateAward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'balanceOfContract',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  }
]
