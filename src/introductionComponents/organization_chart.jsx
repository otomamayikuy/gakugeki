import React from "react";
import Chart from '../OrganizationChart.png'

export default function OrganizationChart() {
    return(
        <div className="explainBox" id="organizationChart">
            <h2>
                <strong>組織図</strong>
            </h2>
            <img src={Chart} alt="組織図" className="OrganizationChartImg"/>
        </div>
    )
}