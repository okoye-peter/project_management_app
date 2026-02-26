"use client";

import { GoeyToaster } from 'goey-toast';
import 'goey-toast/styles.css';

export default function ToasterProvider() {
    return <GoeyToaster position="top-center" />;
}
