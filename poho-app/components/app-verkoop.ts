import {html, css, LitElement, CSSResult, render, TemplateResult} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import '@material/web/list/list.js';


@customElement('app-verkoop')
export class appVerkoop extends LitElement
{
    static styles : CSSResult = css`
    :host {
      }
    `



    render()
    {
        return html`
            <p>Verkoopscherm</p>
        `;
    }
    
}
