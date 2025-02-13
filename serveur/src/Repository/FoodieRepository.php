<?php

namespace App\Repository;

use App\Entity\Foodie;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Foodie>
 *
 * @method Foodie|null find($id, $lockMode = null, $lockVersion = null)
 * @method Foodie|null findOneBy(array $criteria, array $orderBy = null)
 * @method Foodie[]    findAll()
 * @method Foodie[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FoodieRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Foodie::class);
    }

//    /**
//     * @return Foodie[] Returns an array of Foodie objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('f')
//            ->andWhere('f.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('f.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Foodie
//    {
//        return $this->createQueryBuilder('f')
//            ->andWhere('f.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
