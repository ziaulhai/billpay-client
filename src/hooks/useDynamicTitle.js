import { useEffect } from 'react';

const useDynamicTitle = (title) => {

    useEffect(() => {
        const previousTitle = document.title;

        document.title = `${title} | BillPay`;

        return () => {
            document.title = previousTitle;
        };

    }, [title]);
};

export default useDynamicTitle;