<?php

namespace App\Repository;

use App\Entity\ToBe;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ToBe>
 *
 * @method ToBe|null find($id, $lockMode = null, $lockVersion = null)
 * @method ToBe|null findOneBy(array $criteria, array $orderBy = null)
 * @method ToBe[]    findAll()
 * @method ToBe[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ToBeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ToBe::class);
    }

//    /**
//     * @return ToBe[] Returns an array of ToBe objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('t')
//            ->andWhere('t.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('t.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?ToBe
//    {
//        return $this->createQueryBuilder('t')
//            ->andWhere('t.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
