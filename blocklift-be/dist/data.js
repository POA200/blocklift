"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.distributions = exports.metrics = exports.store = void 0;
exports.store = {
    metrics: [
        {
            key: 'children_equipped',
            label: 'Children Equipped',
            desc: 'learning kits delivered',
            value: 5000,
            suffix: '+',
        },
        {
            key: 'verified_donations',
            label: 'Verified Donations',
            desc: 'Donations recorded on-chain (verified)',
            value: 12500,
            prefix: '$',
        },
        {
            key: 'nft_proofs',
            label: 'NFT Proofs Minted',
            desc: 'On-chain receipts minted for donors',
            value: 1240,
        },
        {
            key: 'field_ambassadors',
            label: 'Field Ambassadors',
            desc: 'Local verifiers & volunteers deployed',
            value: 45,
        },
    ],
    distributions: [
        {
            id: 'dist_001',
            schoolName: "St. Mary's Primary School",
            location: 'Ikeja, Lagos',
            status: 'verified',
            studentsImpacted: 125,
            timeAgo: '2 hours ago',
            txId: '0xe7fbc62c',
            supplies: ['25 School Bags'],
            principal: 'Mrs. Adebayo',
            establishedYear: 1995,
            totalStudents: 342,
            totalSuppliesDistributed: 1025,
            imageSrc: "https://via.placeholder.com/400x200/10b981/ffffff?text=St.+Mary's+School",
            isActive: true,
        },
        {
            id: 'dist_002',
            schoolName: 'Lagos Central High School',
            location: 'Lekki, Lagos',
            status: 'pending',
            studentsImpacted: 89,
            timeAgo: '5 hours ago',
            txId: '0xf3d8a9e2',
            supplies: ['15 Textbooks', '20 Notebooks'],
            principal: 'Mr. Okonkwo',
            establishedYear: 2001,
            totalStudents: 450,
            totalSuppliesDistributed: 560,
            imageSrc: 'https://via.placeholder.com/400x200/3b82f6/ffffff?text=Lagos+Central+High',
            isActive: true,
        },
        {
            id: 'dist_003',
            schoolName: 'Abuja Community School',
            location: 'Abuja, FCT',
            status: 'verified',
            studentsImpacted: 156,
            timeAgo: '1 day ago',
            txId: '0x7c9e4f1b',
            supplies: ['30 School Bags', '50 Pens'],
            principal: 'Dr. Chioma',
            establishedYear: 1998,
            totalStudents: 520,
            totalSuppliesDistributed: 1820,
            imageSrc: 'https://via.placeholder.com/400x200/8b5cf6/ffffff?text=Abuja+Community',
            isActive: true,
        },
    ],
};
exports.metrics = exports.store.metrics;
exports.distributions = exports.store.distributions;
//# sourceMappingURL=data.js.map