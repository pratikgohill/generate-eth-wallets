import { Button, CircularProgress, Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import qr from "qrcode";
import ReactToPrint from "react-to-print";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

function QRPage(params) {
  const pdfRef = useRef();

  const [downloadLink, setDownloadLink] = useState("");
  const [codes, setCodes] = useState([]);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const pageStyle = `  
  @media all {
    .pagebreak {
      display: none;
    }
  }
`;

  const myqrcode = (src) => {
    return new Promise((resolve, reject) => {
      qr.toDataURL(src, (err, src) => {
        if (err) reject(false);
        resolve(src);
      });
    });
  };

  useEffect(() => {
    const addresses = [];
    const tempCodes = [];

    params.wallets.map(async (t) => {
      addresses.push(t.address);
      let code = await myqrcode(t.address);
      tempCodes.push(code);
    });

    setCodes(tempCodes);

    const data = new Blob([addresses.join("\n")], { type: "text/plain" });

    if (downloadLink !== "") window.URL.revokeObjectURL(downloadLink);

    setDownloadLink(window.URL.createObjectURL(data));
  }, [params]);

  const handleTest = async () => {
    // try {
    //   const report = new jsPDF("portrait", "pt", "a4");
    //   report.html(document.getElementById("divToPrint")).then(() => {
    //     report.save("report.pdf");
    //   });
    // } catch (err) {
    //   console.log("error K : ", err);
    // }
    const input = document.getElementById("divToPrint");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "JPEG", 0, 0);
      // pdf.output('dataurlnewwindow');
      pdf.save("download.pdf");
    });
  };

  return (
    <div>
      <p>Scan it on metamask and import ;)</p>
      <a download="eth-wallet-addresslist.txt" href={downloadLink}>
        <Button style={{ margin: 30 }}>Download Wallet Address List</Button>
      </a>

      <ReactToPrint
        pageStyle={pageStyle}
        trigger={() => <Button style={{ margin: 30 }}>Print this out!</Button>}
        content={() => pdfRef.current}
      />
      {/* <Button onClick={handleTest}>Test</Button> */}
      <Grid
        id="divToPrint"
        className="pagebreak "
        ref={pdfRef}
        style={{ justifyContent: "center" }}
        container
      >
        {codes.map((t) => (
          <div>
            <Item>
              <img width={160} src={t} />
            </Item>
          </div>
        ))}
      </Grid>
    </div>
  );
}

export default QRPage;
