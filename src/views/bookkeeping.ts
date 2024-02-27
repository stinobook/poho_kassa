import { html, css, LiteElement, property } from '@vandeurenglenn/lite'
import { customElement } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import '@material/web/list/list.js'
import '@material/web/list/list-item.js'
import '@material/web/textfield/filled-text-field.js'
import '@vandeurenglenn/flex-elements/row.js'
import '@vandeurenglenn/flex-elements/container.js'
import '@vandeurenglenn/flex-elements/column.js'
import '@material/web/button/filled-button.js'
import { get, ref, push, getDatabase, child, onChildAdded, onChildRemoved, set } from 'firebase/database'

@customElement('bookkeeping-view')
export class BookkeepingView extends LiteElement {
  @property() accessor books: { [key]: Sales[] } = {}
  static styles = [
    css`
      :host {
        display: flex;
        width: 100%;
        height: 100%;
        position: relative;
        border-radius: var(--md-sys-shape-corner-extra-large);
      }

      ::-webkit-scrollbar {
        width: 8px;
        border-radius: var(--md-sys-shape-corner-extra-large);
        background-color: var(--md-sys-color-surface-container-highest);
      }
      ::-webkit-scrollbar-thumb {
        background: var(--md-sys-color-on-surface-container-highest);
        border-radius: var(--md-sys-shape-corner-extra-large);
        box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.5) inset;
      }
      flex-container {
        max-width: none;
        height: -webkit-fill-available;
        width: -webkit-fill-available;
        position: relative;
        overflow: hidden;
        overflow-y: auto;
        flex-wrap: wrap;
        flex-direction: row;
      }
      .bookTable table {
        width: 100%;
        background-color: #FFFFFF;
        border-collapse: collapse;
        border-width: 2px;
        border-color: #7EA8F8;
        border-style: solid;
        color: #000000;
      }
      .bookTable td, .bookTable th {
        border-width: 2px;
        border-color: #7EA8F8;
        border-style: solid;
        padding: 5px;
      }
      .bookTable thead {
        background-color: #7EA8F8;
      }
    `
  ]

  async connectedCallback() {
    this.shadowRoot.addEventListener('click', ({ target }: CustomEvent) => {
      // @ts-ignore
      let event = new CustomEvent('checkoutTap', { detail: target.getAttribute('bookkeeping-tap')})
      this.renderBooks(event)
    })
  }

  async renderBooks({ detail }: CustomEvent) {
    if (detail === 'loadbooks') {
      let fromDate = (this.shadowRoot.querySelector('#fromDate') as HTMLInputElement).value
      let toDate = (this.shadowRoot.querySelector('#toDate') as HTMLInputElement).value 
      const salesDB = ref(getDatabase(), 'sales')
      //await get(salesDB).then((snapshot) => {
      //  if (snapshot.exists()) {
      //    this.books = snapshot.val()
      //  } else {
      //    console.log("No data available");
      //  }
      //}).catch((error) => {
      //  console.error(error);
      //});
      this.books = {
        "-NretqnqpEVA89ElfTY5": {
            "cashDifferenceCheckout": 0,
            "cashKantine": 16,
            "cashLidgeld": 130,
            "cashStartCheckout": 100,
            "cashTransferCheckout": 155,
            "cashWinkel": 9,
            "date": "2024-02-27T14:08",
            "payconiqKantine": 16,
            "payconiqLidgeld": 0,
            "payconiqWinkel": 12,
            "transactions": {
                "Bieren": {
                    "paymentAmount": {
                        "cash": 8,
                        "payconiq": 0
                    },
                    "transactionItems": [
                        {
                            "amount": 4,
                            "category": "Bieren",
                            "key": "-NpyRrOjwTImr7F0XmKh",
                            "name": "Pils",
                            "paymentMethod": "cash",
                            "price": "2",
                            "quickId": "6",
                            "vat": "21"
                        }
                    ]
                },
                "Frisdranken": {
                    "paymentAmount": {
                        "cash": 8,
                        "payconiq": 0
                    },
                    "transactionItems": [
                        {
                            "amount": 2,
                            "category": "Frisdranken",
                            "key": "-NpyM4KP0V5TPMg2qZCT",
                            "name": "Cola",
                            "paymentMethod": "cash",
                            "price": "2",
                            "quickId": "0",
                            "vat": "21"
                        },
                        {
                            "amount": 1,
                            "category": "Frisdranken",
                            "key": "-NpyRifsbp-pjkj5t9Ge",
                            "name": "Ice-Tea",
                            "paymentMethod": "cash",
                            "price": "2",
                            "quickId": "3",
                            "vat": "21"
                        },
                        {
                            "amount": 1,
                            "category": "Frisdranken",
                            "key": "-NpyRmvrwtKxVzShsdSn",
                            "name": "Spa Bruis",
                            "paymentMethod": "cash",
                            "price": "2",
                            "quickId": "5",
                            "vat": "21"
                        }
                    ]
                },
                "Lidgeld": {
                    "paymentAmount": {
                        "cash": 130,
                        "payconiq": 0
                    },
                    "transactionItems": [
                        {
                            "amount": 1,
                            "category": "Lidgeld",
                            "description": "Test met test",
                            "key": "-NpyU-T1a7eAG9ucOuoa",
                            "name": "Lidgeld",
                            "paymentMethod": "cash",
                            "price": "120",
                            "vat": "0"
                        },
                        {
                            "amount": 1,
                            "category": "Lidgeld",
                            "description": "Testextra",
                            "key": "-NpyU1RJaY7oOTUF_SBn",
                            "name": "Extra lid",
                            "paymentMethod": "cash",
                            "price": "10",
                            "vat": "0"
                        }
                    ]
                },
                "Wijnen & Apero": {
                    "paymentAmount": {
                        "cash": 0,
                        "payconiq": 16
                    },
                    "transactionItems": [
                        {
                            "amount": 4,
                            "category": "Wijnen & Apero",
                            "key": "-NpyT1OVk2jkJP7tR58d",
                            "name": "Witte Wijn 25cl",
                            "paymentMethod": "payconiq",
                            "price": "4",
                            "quickId": "17",
                            "vat": "21"
                        }
                    ]
                },
                "Winkel": {
                    "paymentAmount": {
                        "cash": 9,
                        "payconiq": 12
                    },
                    "transactionItems": [
                        {
                            "amount": 3,
                            "category": "Winkel",
                            "key": "-NpyU5SP4kFrleALZyXr",
                            "name": "Rodiworst",
                            "paymentMethod": "cash",
                            "price": "3",
                            "quickId": "34",
                            "vat": "21"
                        },
                        {
                            "amount": 1,
                            "category": "Winkel",
                            "key": "-NpyUGSDa-iYYGv___Kf",
                            "name": "Poepzakjes",
                            "paymentMethod": "payconiq",
                            "price": "12",
                            "quickId": "38",
                            "vat": "21"
                        }
                    ]
                }
            }
        }
    }
      console.log(this.books)
      this.requestRender()
    }
  }

  render() {
    return html`
      <flex-container direction="row">
      <span><label>Van: <input type="date" id="fromDate"></label></span>
      <span><label>Tot: <input type="date" id="toDate"></label></span>
      <md-filled-button @bookkeeping-click=${(event) => this.loadBooks(event)} bookkeeping-tap="loadbooks" >Load</md-filled-button>
      <table class="bookTable">
      <thead>
        <tr>
          <th>Datum</th>
          <th>Transactie</th>
          <th>???</th>
          <th>Cash uit</th>
          <th>Cash in</th>
          <th>Rekening uit</th>
          <th>Rekening in</th>
        </tr>
      </thead>
      <tbody>
      ${this.books
        ? Object.entries(this.books).map(
            ([key, value]) => html`
            <tr>
            <td>${value.date}</td>
            <td>Winkel</td>
            <td></td>
            <td></td>
            <td>${value.cashWinkel}</td>
            <td></td>
            <td>${value.payconiqWinkel}</td>
            </tr>
            <tr>
            <td>${value.date}</td>
            <td>Lidgeld</td>
            <td></td>
            <td></td>
            <td>${value.cashLidgeld}</td>
            <td></td>
            <td>${value.payconiqLidgeld}</td>
            </tr>
            <tr>
            <td>${value.date}</td>
            <td>Kantine</td>
            <td></td>
            <td></td>
            <td>${value.cashKantine}</td>
            <td></td>
            <td>${value.payconiqKantine}</td>
            </tr>
            `
          )
        : ''}
        </tbody>
        </table>
      </flex-container>
    `
  }
}
