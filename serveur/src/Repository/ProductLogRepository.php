<?php

namespace App\Repository;

use App\Entity\ProductLog;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ProductLog>
 *
 * @method ProductLog|null find($id, $lockMode = null, $lockVersion = null)
 * @method ProductLog|null findOneBy(array $criteria, array $orderBy = null)
 * @method ProductLog[]    findAll()
 * @method ProductLog[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProductLogRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ProductLog::class);
    }

//    /**
//     * @return ProductLog[] Returns an array of ProductLog objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('p.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?ProductLog
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
