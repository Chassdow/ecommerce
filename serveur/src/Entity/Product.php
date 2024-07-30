<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 55)]
    private ?string $name = null;

    #[ORM\Column]
    private ?int $price = null;

    #[ORM\Column(length: 255)]
    private ?string $description = null;

    #[ORM\ManyToOne(inversedBy: 'produit')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Categorie $categorie = null;

    #[ORM\Column(length: 255)]
    private ?string $introduction = null;

    #[ORM\Column(length: 355)]
    private ?string $urlIMG = null;

    #[ORM\OneToMany(mappedBy: 'product', targetEntity: ToBe::class, fetch: 'EAGER')]
    private Collection $toBes;

    #[ORM\OneToMany(mappedBy: 'product', targetEntity: Ingredient::class, fetch: 'EAGER', cascade: ['persist', 'remove'])]
    private Collection $ingredients;

    #[ORM\OneToMany(targetEntity: Stock::class, mappedBy: 'product')]
    private Collection $stocks;

    #[ORM\OneToMany(targetEntity: ProductLog::class, mappedBy: 'product')]
    private Collection $productLogs;

    public function __construct()
    {
        $this->toBes = new ArrayCollection();
        $this->ingredients = new ArrayCollection();
        $this->stocks = new ArrayCollection();
        $this->productLogs = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(int $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getCategorie(): ?Categorie
    {
        return $this->categorie;
    }

    public function setCategorie(?Categorie $categorie): static
    {
        $this->categorie = $categorie;

        return $this;
    }

    public function getIntroduction(): ?string
    {
        return $this->introduction;
    }

    public function setIntroduction(string $introduction): static
    {
        $this->introduction = $introduction;

        return $this;
    }

    public function getUrlIMG(): ?string
    {
        return $this->urlIMG;
    }

    public function setUrlIMG(string $urlIMG): static
    {
        $this->urlIMG = $urlIMG;

        return $this;
    }
    public function getToBes(): Collection
    {
        return $this->toBes;
    }

    public function addToBe(ToBe $toBe): static
    {
        if (!$this->toBes->contains($toBe)) {
            $this->toBes->add($toBe);
            $toBe->setProduct($this);
        }
        return $this;
    }

    public function removeToBe(ToBe $toBe): static
    {
        if ($this->toBes->removeElement($toBe)) {
            if ($toBe->getProduct() === $this) {
                $toBe->setProduct(null);
            }
        }
        return $this;
    }

    public function getIngredients(): Collection
    {
        return $this->ingredients;
    }

    public function addIngredient(Ingredient $ingredient): static
    {
        if (!$this->ingredients->contains($ingredient)) {
            $this->ingredients->add($ingredient);
            $ingredient->setProduct($this);
        }
        return $this;
    }

    public function removeIngredient(Ingredient $ingredient): static
    {
        if ($this->ingredients->removeElement($ingredient)) {
            if ($ingredient->getProduct() === $this) {
                $ingredient->setProduct(null);
            }
        }
        return $this;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->getId(),
            'name' => $this->getName(),
            'price' => $this->getPrice(),
            'description' => $this->getDescription(),
            'introduction' => $this->getIntroduction(),
            'urlIMG' => $this->getUrlIMG(),
            'categorie' => $this->getCategorie() ? $this->getCategorie()->toArray() : null,
            'toBes' => array_map(fn(ToBe $toBe) => $toBe->toArray(), $this->getToBes()->toArray()),
            'ingredients' => array_map(fn(Ingredient $ingredient) => $ingredient->toArray(), $this->getIngredients()->toArray()),
        ];
    }

    /**
     * @return Collection<int, Stock>
     */
    public function getStocks(): Collection
    {
        return $this->stocks;
    }

    public function addStock(Stock $stock): static
    {
        if (!$this->stocks->contains($stock)) {
            $this->stocks->add($stock);
            $stock->setProduct($this);
        }

        return $this;
    }

    public function removeStock(Stock $stock): static
    {
        if ($this->stocks->removeElement($stock)) {
            // set the owning side to null (unless already changed)
            if ($stock->getProduct() === $this) {
                $stock->setProduct(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ProductLog>
     */
    public function getProductLogs(): Collection
    {
        return $this->productLogs;
    }

    public function addProductLog(ProductLog $productLog): static
    {
        if (!$this->productLogs->contains($productLog)) {
            $this->productLogs->add($productLog);
            $productLog->setProduct($this);
        }

        return $this;
    }

    public function removeProductLog(ProductLog $productLog): static
    {
        if ($this->productLogs->removeElement($productLog)) {
            // set the owning side to null (unless already changed)
            if ($productLog->getProduct() === $this) {
                $productLog->setProduct(null);
            }
        }

        return $this;
    }
}
