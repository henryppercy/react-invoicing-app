import InvoiceCards from "./InvoiceCards";
import NewInvoice from "./NewInvoice";
import ViewInvoice from "./ViewInvoice";
import {useEffect, useState} from "react";

const Invoices = () => {

    const detailedInvoice = {
        data: {
            id: "",
            invoice_id: "",
            name: "",
            street_address: "",
            city: "",
            created: "",
            due: "",
            invoice_total: "",
            paid_to_date: "",
            status: "",
            status_name: "",
            details: [
                {
                    description: "",
                    quantity: "",
                    rate: "",
                    total: ""
                },
            ]
        }
    }

    const initialDetailsState = [];

    const [detailedInvoiceState, setDetailedInvoiceState] = useState(detailedInvoice);
    const [detailsState, setDetailsState] = useState(initialDetailsState);

    const fetchDetailedInvoice = async (invoiceId) => {
        const response = await fetch(`http://localhost:8080/invoices/${invoiceId}`);

        return await response.json();
    }

    const handleCardClick = (id) => {
        fetchDetailedInvoice(id)
            .then((detailedInvoiceData) => {
                setDetailedInvoiceState(detailedInvoiceData.data);
                setDetailsState(detailedInvoiceData.data.details);
            })
    }

    const [invoices, setInvoices] = useState([]);

    // --- fetch invoices and returns json promise ---
    const extractResponseData = (response) => {
        return response.json();
    }

    const fetchInvoices = async () => {
        const response = await fetch('http://localhost:8080/invoices');
        if (!response.ok) {
            throw new Error();
        }
        return await extractResponseData(response);
    }

    useEffect( () => {
        fetchInvoices()
            .then((invoiceData) => {
                setInvoices(invoiceData.data);
            })
            .catch((err) => {
                err.message = 'Error! Could not resolve promise.';
            });
    }, []);

    // --- filtered unpaid invoices ---
    const filteredInvoices = invoices.filter(invoice => invoice.status === "2");
    const unpaidInvoices = filteredInvoices.length;

    return (
        <>
            <ViewInvoice detailedInvoiceState={detailedInvoiceState} detailsState={detailsState}/>

            <div className="py-5 px-3">
            <header className="d-flex justify-content-between align-items-end flex-wrap pt-3 px-0">
                <div>
                    <h1 className="fw-bolder">Invoices</h1>
                    <p>There are {unpaidInvoices} unpaid invoices</p>
                </div>
                <div className="d-flex justify-content-between py-3">
                    <div className="dropdown">
                        <button className="btn btn-light dropdown-toggle fs-6 fw-bold text-dark me-1" type="button"
                                id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            Sort By
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li><a className="dropdown-item fs-6" href="#">Invoice Reference</a></li>
                            <li><a className="dropdown-item fs-6" href="#">Invoice Total</a></li>
                            <li><a className="dropdown-item fs-6" href="#">Date Created</a></li>
                            <li><a className="dropdown-item fs-6" href="#">Date Due</a></li>
                        </ul>
                    </div>
                    <div className="dropdown">
                        <button className="btn btn-light dropdown-toggle fs-6 fw-bold text-dark me-4" type="button"
                                id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            Filter By Status
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li><a className="dropdown-item fs-6" href="#">Paid</a></li>
                            <li><a className="dropdown-item fs-6" href="#">Pending</a></li>
                            <li><a className="dropdown-item fs-6" href="#">Cancelled</a></li>
                            <li><a className="dropdown-item fs-6" href="#">Overdue</a></li>
                            <li><a className="dropdown-item fs-6" href="#">View All</a></li>
                        </ul>
                    </div>
                    <p>
                        <button type="button" className="btn btn-info text-nowrap">
                            <div className="badge text-bg-dark p-1"><i className="fa-solid fa-plus fa-lg"></i></div>
                            <span className="text-white fs-5"> New Invoice</span>
                        </button>
                    </p>
                </div>
            </header>
            <main>
                {invoices.map((invoice) => {
                        return (
                            <InvoiceCards handleCardClick={handleCardClick} invoice={invoice} />
                            );
                    })
                }

            </main>
            <footer>
                <hr className="col-12 mt-4"/>
                <div className="col-12">© Copyright iO Academy 2022</div>
            </footer>
            </div>

            <NewInvoice />
        </>
    );
}

export default Invoices;