import {html, css, LitElement, CSSResult, render, TemplateResult} from 'lit'
import {customElement, property} from 'lit/decorators.js'


@customElement('app-prijslijst')
export class appPrijslijst extends LitElement
{
    render()
    {
        return html`
            <p>Prijslijst</p>
        `;
    }
}
