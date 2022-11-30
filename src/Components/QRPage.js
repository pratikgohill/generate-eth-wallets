import { Button, CircularProgress, Grid, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import qr from "qrcode";
import html2pdf from "html2pdf.js";

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

  const handlePDFCreation = async () => {
    const input = document.getElementById("divToPrint");
    await html2pdf(input, {
      filename: "eth-wallets-qrcodes",
      pagebreak: { mode: "avoid-all" },
    });
  };

  return (
    <div>
      <p>Scan it on metamask and import ;)</p>
      <a download="eth-wallet-addresslist.txt" href={downloadLink}>
        <Button style={{ margin: 30 }}>Download Wallet Address List</Button>
      </a>
      <Button style={{ margin: 30 }} onClick={handlePDFCreation}>
        Generate PDF
      </Button>
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
