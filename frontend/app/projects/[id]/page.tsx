"use client";

import ProjectHeader from '@/components/ProjectHeader';
import Board from '@/components/projects/BoardView';
import List from '@/components/projects/ListView';
import Table from '@/components/projects/TableView';
import TimeLine from '@/components/projects/TimeLineView';
import { useParams } from 'next/navigation';
import { useState } from 'react'

const ShowProject = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState('Board');
    const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);


    return (
        <>
            {/* MODAL NEW TASK */}

            <ProjectHeader
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            {activeTab === 'Board' && <Board id={id} setIsNewTaskModalOpen={setIsNewTaskModalOpen} />}
            {activeTab === 'List' && <List id={id} setIsNewTaskModalOpen={setIsNewTaskModalOpen} />}
            {activeTab === 'Timeline' && <TimeLine id={id} setIsNewTaskModalOpen={setIsNewTaskModalOpen} />}
            {activeTab === 'Table' && <Table id={id} setIsNewTaskModalOpen={setIsNewTaskModalOpen} />}
        </>
    )
}

export default ShowProject