import {html, css, LitElement, CSSResult, render, TemplateResult} from 'lit'
import {customElement, property} from 'lit/decorators.js'
import '@material/web/list/list.js';


@customElement('app-aanwezigheidslijst')
export class appAanwezigheidslijst extends LitElement
{
    static styles : CSSResult = css`
    :host {
      }
    `



    render()
    {
        return html`
            <p>Aanwezigheidsscherm</p>
        `;
    }
    
}
