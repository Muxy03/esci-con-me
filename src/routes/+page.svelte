<script lang="ts">
  import type { PageProps } from "./$types";
  import Chart from "../components/Chart.svelte";
  import Select from "../components/Select.svelte";
  import Radio from "../components/Radio.svelte";
  import getTempChange from "../helpers/getTempChange.ts";
  import Table from "../components/Table.svelte";
  import CodeHighlight from "../components/CodeHighlight.svelte";
  import Highlight from "../components/Highlight.svelte";

  // Data included in the build.
  import tempRegr from "../data/temp-regressions.json";

  // Data fetched by the server/client from +page.ts
  const { data } = $props();
  const { temp } = data;

  let city = $state("Montreal");
  const cities = tempRegr.map((d) => d.city);

  let testRadioInput = $state("option1");
</script>

<h2>Climate change</h2>

<Select bind:value={city} options={cities} label="Pick a city:" />

<p>
  On average, the temperature in <b>{city}</b> has increased by {getTempChange(
    city,
    tempRegr,
  )} per decade.
</p>

<Chart {city} {temp} {tempRegr} />

<p>Here's all the data.</p>

<Table data={temp.filter((d) => d.city === city)} />

<h2>Methodology</h2>

<p>
  This project uses a simple linear regression to estimate the temperature
  change in each city. The data comes from the Adjusted and Homogenized
  Canadian Climate Data (AHCCD) dataset.
</p>

<p>
  To compute the regressions, we used the <a
    href="https://github.com/nshiab/simple-data-analysis"
    >simple-data-analysis</a
  > library.
</p>

<CodeHighlight
  filename="crunchData.ts"
  code={`import type { SimpleDB } from "@nshiab/simple-data-analysis";

export default async function crunchData(sdb: SimpleDB) {
  // The mean temperature per decade.
  const temp = sdb.newTable("temp");
  await temp.loadData("sda/data/temp.csv");

  // We log the table.
  await temp.logTable();

  // We log line charts.
  await temp.logLineChart("decade", "meanTemp", {
    smallMultiples: "city",
    fixedScales: true,
    formatY: (d) => \`\${d}°C\`,
  });

  // We compute a linear regression for each city.
  const tempRegressions = await temp.linearRegressions({
    x: "decade",
    y: "meanTemp",
    categories: "city",
    decimals: 4,
    outputTable: "tempRegressions",
  });
  await tempRegressions.logTable();

  // We write the results to src/data
  await tempRegressions.writeData("src/data/temp-regressions.json");
  // Or to static
  await temp.writeData("static/temp.json");
}
`}
  />

<h2>Other components</h2>

<p>
  There is a component to easily <Highlight
    text="highlight text"
    background="orange"
    color="white"
  />.
</p>

<p>
  And there is also a component for radio buttons (<b>{testRadioInput}</b> is selected)
</p>

<Radio
  bind:value={testRadioInput}
  values={["option1", "option2", "option3"]}
  label="Pick an option:"
  name="radioButtonsOptions"
/>
