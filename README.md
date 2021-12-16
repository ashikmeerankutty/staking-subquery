## Staking subquery

This subquery contains various information for PolkStakes app. This includes validator infos, referendums, nominations, staking rewards, council votes etc

### Sample Query

```
query {
    councilVotes (first: 5) {
        nodes {
            id
            stake
            votes
        }
    }
    eraPoints (first: 5) {
        nodes {
            id
            eraPoints
            validators
        }
    }
}
```

### Sample Response

```
{
  "data": {
    "councilVotes": {
      "nodes": [
        {
          "id": "11gqpAyU17G9EFW5n5MNngh824F3Y2as72V2rgc7Wq5JVRd",
          "stake": "50585416000000000",
          "votes": [
            "16UJBPHVqQ3xYXnmhEpaQtvSRnrP9k1XeE7WxoyCxsrL9AvV",
            "12Y8b4C9ar162cBgycxYgxxHG7cLVs8gre9Y5xeMjW3izqer",
            "12mP4sjCfKbDyMRAEyLpkeHeoYtS5USY4x34n9NMwQrcEyoh",
            "13RDY9nrJpyTDBSUdBw12dGwhk19sGwsrVZ2bxkzYHBSagP2",
            "167rjWHghVwBJ52mz8sNkqr5bKu5vpchbc9CBoieBhVX714h"
          ]
        },
        {
          "id": "11Q7ismkHUbbUexpQc4DgTvedfsh8jKMDV7jZZoQwv57NLS",
          "stake": "81338280000000000",
          "votes": [
            "13RDY9nrJpyTDBSUdBw12dGwhk19sGwsrVZ2bxkzYHBSagP2",
            "1363HWTPzDrzAQ6ChFiMU6mP4b6jmQid2ae55JQcKtZnpLGv",
            "14mSXQeHpF8NT1tMKu87tAbNDNjm7q9qh8hYa7BY2toNUkTo",
            "14DQEq1XtPvntMyUFbgcDCSce79s1CBum3rBYrEeB66qgTqG",
            "12hAtDZJGt4of3m2GqZcUCVAjZPALfvPwvtUTFZPQUbdX1Ud",
            "12NLgzqfhuJkc9mZ5XUTTG85N8yhhzfptwqF1xVhtK3ZX7f6",
            "14mwSGdhdrAA3pGoKSX1tWguFREswWucAsr7kcHbdsf7fU7Q",
            "1629Shw6w88GnyXyyUbRtX7YFipQnjScGKcWr1BaRiMhvmAg",
            "13Gdmw7xZQVbVoojUCwnW2usEikF2a71y7aocbgZcptUtiX9",
            "12Y8b4C9ar162cBgycxYgxxHG7cLVs8gre9Y5xeMjW3izqer"
          ]
        },
        {
          "id": "121BQqP4WxxeyucaLZixRPFWnmvYyhTTvY4iZMHxmUJfUDnZ",
          "stake": "498773000000",
          "votes": [
            "1hCMdtRsaRA4ZTEKpPKPvEjK9rZpGhyFnRHSDhqFMCEayRL",
            "167rjWHghVwBJ52mz8sNkqr5bKu5vpchbc9CBoieBhVX714h",
            "12RYJb5gG4hfoWPK3owEYtmWoko8G6zwYpvDYTyXFVSfJr8Y",
            "1363HWTPzDrzAQ6ChFiMU6mP4b6jmQid2ae55JQcKtZnpLGv",
            "14DQEq1XtPvntMyUFbgcDCSce79s1CBum3rBYrEeB66qgTqG",
            "12hAtDZJGt4of3m2GqZcUCVAjZPALfvPwvtUTFZPQUbdX1Ud",
            "14mR4xpU4BwYTTFNwMJ7KJ81yqNiNxGUFL4e3GxVsN27YNTE",
            "16UJBPHVqQ3xYXnmhEpaQtvSRnrP9k1XeE7WxoyCxsrL9AvV",
            "13RDY9nrJpyTDBSUdBw12dGwhk19sGwsrVZ2bxkzYHBSagP2",
            "12NLgzqfhuJkc9mZ5XUTTG85N8yhhzfptwqF1xVhtK3ZX7f6",
            "14ShUZUYUR35RBZW6uVVt1zXDxmSQddkeDdXf1JkMA6P721N",
            "13Gdmw7xZQVbVoojUCwnW2usEikF2a71y7aocbgZcptUtiX9",
            "12Y8b4C9ar162cBgycxYgxxHG7cLVs8gre9Y5xeMjW3izqer",
            "12mP4sjCfKbDyMRAEyLpkeHeoYtS5USY4x34n9NMwQrcEyoh",
            "12Vv2LsLCvPKiXdoVGa3QSs2FMF8zx2c8CPTWwLAwfYSFVS1",
            "12xGDBh6zSBc3D98Jhw9jgUVsK8jiwGWHaPTK21Pgb7PJyPn"
          ]
        },
        {
          "id": "121YHCtd97fn19zttCTVLdC8mjX81ry53X7MpMNsi93JTFHy",
          "stake": "1700000000000000",
          "votes": [
            "13Gdmw7xZQVbVoojUCwnW2usEikF2a71y7aocbgZcptUtiX9",
            "16UJBPHVqQ3xYXnmhEpaQtvSRnrP9k1XeE7WxoyCxsrL9AvV",
            "13RDY9nrJpyTDBSUdBw12dGwhk19sGwsrVZ2bxkzYHBSagP2"
          ]
        },
        {
          "id": "1243tzEb446NSpWzPcaeMGpJh2YZ4TwMb4B85yVCt4275fD8",
          "stake": "25000000000000000",
          "votes": [
            "1rwgen2jqJNNg7DpUA4jBvMjyepgiFKLLm3Bwt8pKQYP8Xf",
            "128qRiVjxU3TuT37tg7AX99zwqfPtj2t4nDKUv9Dvi5wzxuF",
            "12Vv2LsLCvPKiXdoVGa3QSs2FMF8zx2c8CPTWwLAwfYSFVS1",
            "12Y8b4C9ar162cBgycxYgxxHG7cLVs8gre9Y5xeMjW3izqer",
            "14mwSGdhdrAA3pGoKSX1tWguFREswWucAsr7kcHbdsf7fU7Q"
          ]
        }
      ]
    },
    "eraPoints": {
      "nodes": [
        {
          "id": "467",
          "eraPoints": "0",
          "validators": "{}"
        },
        {
          "id": "468",
          "eraPoints": "0",
          "validators": "{}"
        },
        {
          "id": "469",
          "eraPoints": "0",
          "validators": "{}"
        },
        {
          "id": "470",
          "eraPoints": "0",
          "validators": "{}"
        },
        {
          "id": "471",
          "eraPoints": "0",
          "validators": "{}"
        }
      ]
    }
  }
```
