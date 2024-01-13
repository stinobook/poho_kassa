import {html, css, LitElement, CSSResult, render, TemplateResult} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import '@material/web/list/list.js';


@customElement('app-afsluit')
export class appKassaAfsluit extends LitElement
{
    static styles : CSSResult = css`
    :host {
      }
    `

    

    @property() 
        muntEenheid = [
            '€ 100', 
            '€ 50', 
            '€ 20', 
            '€ 10', 
            '€ 5', 
            '€ 2', 
            '€ 1', 
            '€ 0.50', 
            '€ 0.20', 
            '€ 0.10', 
        ];


    render(): TemplateResult<1> 
    {
        return html`
            <md-list>
                ${this.muntEenheid.map((waarde) =>
                    html`<md-list-item>${waarde}</md-list-item>`
                )}
            </md-list>
        `;
    }
    
}
